package message

// MessageAck confirms message delivery.
type MessageAck struct {
	MessageID string `json:"messageId"`
	Code      int    `json:"code"`
}

const (
	AckSuccess = 0
	AckFailed  = 1
)
