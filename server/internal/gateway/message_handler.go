package gateway

// MessageHandler processes client messages.
type MessageHandler struct {
}

func (h *MessageHandler) Handle(messageType string, payload []byte) error {
	// TODO:
	// LOGIN
	// HEARTBEAT
	// CHAT_MESSAGE
	// PET_SYNC
	return nil
}
