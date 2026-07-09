package gateway

import "time"

const HeartbeatInterval = 30 * time.Second

// Heartbeat handles client connection keep alive.
type Heartbeat struct {
	LastActive time.Time
}

func (h *Heartbeat) Update() {
	h.LastActive = time.Now()
}
