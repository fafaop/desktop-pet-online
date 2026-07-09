package gateway

import (
	"log"
	"net/http"
)

// Server represents websocket gateway server.
type Server struct {
	Address string
}

func (s *Server) Start() error {
	http.HandleFunc("/ws", s.handleWebSocket)
	log.Printf("gateway listening on %s", s.Address)
	return http.ListenAndServe(s.Address, nil)
}

func (s *Server) handleWebSocket(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusNotImplemented)
}
