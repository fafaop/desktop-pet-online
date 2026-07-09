package main

import (
	"encoding/json"
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

type Message struct {
	Type string      `json:"type"`
	Data interface{} `json:"data"`
}

type Client struct {
	conn *websocket.Conn
	id   string
}

type Hub struct {
	clients map[*Client]bool
	mu      sync.RWMutex
}

func NewHub() *Hub {
	return &Hub{clients: make(map[*Client]bool)}
}

func (h *Hub) Add(c *Client) {
	h.mu.Lock()
	defer h.mu.Unlock()
	h.clients[c] = true
}

func (h *Hub) Remove(c *Client) {
	h.mu.Lock()
	defer h.mu.Unlock()
	delete(h.clients, c)
}

func (h *Hub) Broadcast(msg Message) {
	data, _ := json.Marshal(msg)
	h.mu.RLock()
	defer h.mu.RUnlock()
	for c := range h.clients {
		_ = c.conn.WriteMessage(websocket.TextMessage, data)
	}
}

func main() {
	hub := NewHub()

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			return
		}

		client := &Client{conn: conn}
		hub.Add(client)
		defer func() {
			hub.Remove(client)
			conn.Close()
		}()

		for {
			_, data, err := conn.ReadMessage()
			if err != nil {
				break
			}

			var msg Message
			if json.Unmarshal(data, &msg) == nil {
				hub.Broadcast(msg)
			}
		}
	})

	log.Println("desktop pet server listening on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
