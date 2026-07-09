package gateway

import (
	"net/http"
)

// Upgrade creates websocket connection from HTTP request.
func (s *Server) Upgrade(w http.ResponseWriter, r *http.Request) error {
	// TODO:
	// 1. websocket upgrader
	// 2. create ClientSession
	// 3. start read/write loops
	return nil
}
