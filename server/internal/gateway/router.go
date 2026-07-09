package gateway

import "net/http"

func RegisterRoutes(s *Server) {
	http.HandleFunc("/ws", s.HandleWebSocket)
}
