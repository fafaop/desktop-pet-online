package message

// Router forwards messages between users.
type Router struct {
}

func (r *Router) SendToUser(userID int64, payload []byte) error {
	// TODO: locate user session and push message
	return nil
}
