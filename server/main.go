package main

import (
	"encoding/json"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{CheckOrigin: func(r *http.Request) bool { return true }}

type Message struct {
	Type string          `json:"type"`
	Data json.RawMessage `json:"data"`
}

type LoginData struct {
	UserID string `json:"user_id"`
	Name   string `json:"name"`
}

type Client struct {
	conn   *websocket.Conn
	userID string
}

type Server struct {
	clients map[*Client]bool
	users   map[string]*Client
	mu      sync.RWMutex
}

func NewServer() *Server {
	return &Server{clients: make(map[*Client]bool), users: make(map[string]*Client)}
}

func (s *Server) add(c *Client) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.clients[c] = true
}

func (s *Server) remove(c *Client) {
	s.mu.Lock()
	defer s.mu.Unlock()
	delete(s.clients, c)
	if c.userID != "" {
		delete(s.users, c.userID)
	}
}

func (s *Server) send(c *Client, msg interface{}) {
	data, _ := json.Marshal(msg)
	_ = c.conn.WriteMessage(websocket.TextMessage, data)
}

func (s *Server) broadcast(msg interface{}) {
	data, _ := json.Marshal(msg)
	s.mu.RLock()
	defer s.mu.RUnlock()
	for c := range s.clients {
		_ = c.conn.WriteMessage(websocket.TextMessage, data)
	}
}

func (s *Server) handle(conn *websocket.Conn) {
	client := &Client{conn: conn}
	s.add(client)
	defer func() { s.remove(client); conn.Close() }()

	lastHeartbeat := time.Now()

	for {
		_, data, err := conn.ReadMessage()
		if err != nil {
			return
		}

		var msg Message
		if json.Unmarshal(data, &msg) != nil {
			continue
		}

		switch msg.Type {
		case "login":
			var login LoginData
			if json.Unmarshal(msg.Data, &login) == nil {
				client.userID = login.UserID
				s.mu.Lock()
				s.users[login.UserID] = client
				s.mu.Unlock()
				s.send(client, map[string]interface{}{"type":"login_response","success":true,"user_id":login.UserID})
			}
		case "heartbeat":
			lastHeartbeat = time.Now()
		case "chat":
			s.broadcast(map[string]interface{}{"type":"chat","data":msg.Data})
		case "pet_state":
			s.broadcast(map[string]interface{}{"type":"pet_state","data":msg.Data})
		}

		if time.Since(lastHeartbeat) > 60*time.Second {
			return
		}
	}
}

func main() {
	server := NewServer()
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil { return }
		server.handle(conn)
	})

	log.Println("desktop pet demo server :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
