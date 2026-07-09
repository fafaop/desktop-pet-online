package gateway

import "time"

func NewResponse(msgType string, data interface{}) Message {
	return Message{
		Version:   "1.0",
		Type:      msgType,
		Timestamp: time.Now().Unix(),
		Data:      data,
	}
}
