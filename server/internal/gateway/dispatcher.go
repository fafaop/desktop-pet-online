package gateway

// Dispatcher routes messages to services.
type Dispatcher struct {
}

func (d *Dispatcher) Dispatch(msg Message) error {
	switch msg.Type {
	case "LOGIN_REQUEST":
		// auth service
	case "HEARTBEAT_REQUEST":
		// heartbeat response
	case "CHAT_MESSAGE":
		// message service
	case "PET_SYNC":
		// pet service
	}

	return nil
}
