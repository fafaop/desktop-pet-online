package gateway

// WriteLoop sends queued messages to client.
func WriteLoop(session *ClientSession) {
	for message := range session.Send {
		_ = message
		// TODO write websocket message
	}
}
