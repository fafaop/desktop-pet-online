package gateway

import "net/http"

// HandleWebSocket upgrades and manages websocket clients.
func (s *Server) HandleWebSocket(w http.ResponseWriter, r *http.Request) {
	// TODO:
	// 1. websocket upgrade
	// 2. create connection
	// 3. register session
}
