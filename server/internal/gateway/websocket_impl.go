package gateway

import "net/http"

// WebSocketImpl handles websocket server lifecycle.
type WebSocketImpl struct {
	Server *Server
}

func (w *WebSocketImpl) ServeHTTP(rw http.ResponseWriter, req *http.Request) {
	// TODO:
	// 1. upgrade websocket
	// 2. create session
	// 3. start read/write loops
}
