package protocol

const (
	LoginRequest  = "login"
	LoginResponse = "login_response"
	ChatMessage   = "chat"
	Heartbeat     = "heartbeat"
	PetState      = "pet_state"
)

type Message struct {
	Type string      `json:"type"`
	Data interface{} `json:"data"`
}

type LoginRequestData struct {
	UserID string `json:"user_id"`
	Name   string `json:"name"`
}

type LoginResponseData struct {
	Success bool   `json:"success"`
	UserID  string `json:"user_id"`
	Message string `json:"message"`
}
