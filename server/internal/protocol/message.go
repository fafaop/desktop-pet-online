package protocol

// Message is the common websocket envelope.
type Message struct {
	Type string      `json:"type"`
	Data interface{} `json:"data"`
}

const (
	LoginRequest     = "LOGIN_REQUEST"
	LoginResponse    = "LOGIN_RESPONSE"
	HeartbeatRequest = "HEARTBEAT_REQUEST"
	HeartbeatReply   = "HEARTBEAT_RESPONSE"
	ChatMessage      = "CHAT_MESSAGE"
)
