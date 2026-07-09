package gateway

// ConnectionHandler manages websocket lifecycle.
type ConnectionHandler struct {
	Registry *Registry
}

func (h *ConnectionHandler) OnConnect(session *ClientSession) {
	// register session after authentication
}

func (h *ConnectionHandler) OnClose(session *ClientSession) {
	// cleanup session
}
