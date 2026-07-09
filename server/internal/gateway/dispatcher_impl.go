package gateway

// DispatcherImpl maps protocol messages to handlers.
type DispatcherImpl struct {
}

func (d *DispatcherImpl) Dispatch(message Message) error {
	switch message.Type {
	case "LOGIN_REQUEST":
	case "HEARTBEAT_REQUEST":
	case "CHAT_MESSAGE":
	case "PET_SYNC":
	}
	return nil
}
