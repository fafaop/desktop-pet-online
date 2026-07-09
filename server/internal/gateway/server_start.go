package gateway

import "net/http"

// Start launches gateway HTTP server.
func Start(addr string) error {
	http.Handle("/ws", &WebSocketImpl{})
	return http.ListenAndServe(addr, nil)
}
