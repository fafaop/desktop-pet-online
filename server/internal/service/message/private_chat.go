package message

// PrivateMessage represents one-to-one chat data.
type PrivateMessage struct {
	FromUserID int64  `json:"fromUserId"`
	ToUserID   int64  `json:"toUserId"`
	Content    string `json:"content"`
}

// HandlePrivateMessage processes private chat messages.
func (r *Router) HandlePrivateMessage(msg PrivateMessage) error {
	// TODO:
	// 1. find receiver session
	// 2. push message
	// 3. return ACK
	return nil
}
