package gateway

import "sync"

// ClientSession represents an online websocket client.
type ClientSession struct {
	ID     string
	UserID int64
	Send   chan []byte
}

// SessionManager stores active clients.
type SessionManager struct {
	items map[string]*ClientSession
	lock  sync.RWMutex
}

func NewSessionManager() *SessionManager {
	return &SessionManager{items: make(map[string]*ClientSession)}
}

func (m *SessionManager) Add(session *ClientSession) {
	m.lock.Lock()
	defer m.lock.Unlock()
	m.items[session.ID] = session
}

func (m *SessionManager) Remove(id string) {
	m.lock.Lock()
	defer m.lock.Unlock()
	delete(m.items, id)
}
