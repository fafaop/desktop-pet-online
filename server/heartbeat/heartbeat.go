package heartbeat

import (
	"sync"
	"time"
)

type Manager struct {
	clients map[string]time.Time
	mu      sync.RWMutex
}

func NewManager() *Manager {
	return &Manager{
		clients: make(map[string]time.Time),
	}
}

func (m *Manager) Update(userID string) {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.clients[userID] = time.Now()
}

func (m *Manager) Timeout(userID string, duration time.Duration) bool {
	m.mu.RLock()
	defer m.mu.RUnlock()

	t, ok := m.clients[userID]
	if !ok {
		return true
	}

	return time.Since(t) > duration
}
