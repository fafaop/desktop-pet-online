package user

import "time"

// User represents an online player.
type User struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Online    bool      `json:"online"`
	CreatedAt time.Time `json:"created_at"`
}

func NewUser(id string, name string) *User {
	return &User{
		ID:        id,
		Name:      name,
		Online:    true,
		CreatedAt: time.Now(),
	}
}
