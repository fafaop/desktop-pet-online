package gateway

// WebSocketConnection represents a connected client.
type WebSocketConnection struct {
	Session *ClientSession
}

func (c *WebSocketConnection) Start() {
	// TODO:
	// start read loop
	// start write loop
}

func (c *WebSocketConnection) Close() {
	// TODO cleanup connection
}
