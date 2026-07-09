package message

import "github.com/fafaop/desktop-pet-online/server/internal/gateway"

// PrivateRouter delivers messages to online users.
type PrivateRouter struct {
	Registry *gateway.Registry
}

func (r *PrivateRouter) Send(userID int64, data []byte) error {
	session := r.Registry.Find(userID)
	if session == nil {
		return nil
	}

	session.Send <- data
	return nil
}
