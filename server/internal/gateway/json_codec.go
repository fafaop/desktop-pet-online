package gateway

import "encoding/json"

// Message defines common protocol envelope.
type Message struct {
	Version   string      `json:"version"`
	Type      string      `json:"type"`
	RequestID string      `json:"requestId"`
	Timestamp int64       `json:"timestamp"`
	Data      interface{} `json:"data"`
}

func EncodeMessage(msg Message) ([]byte, error) {
	return json.Marshal(msg)
}

func DecodeMessage(data []byte, msg *Message) error {
	return json.Unmarshal(data, msg)
}
