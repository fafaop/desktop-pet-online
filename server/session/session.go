package session

import (
	"sync"

	"github.com/gorilla/websocket"
)

// Session binds websocket connection with user.
type Session struct {
	UserID string
	Conn   *websocket.Conn
}

// Manager manages active websocket sessions.
type Manager struct {
	sessions map[string]*Session
	mu       sync.RWMutex
}

func NewManager() *Manager {
	return &Manager{
		sessions: make(map[string]*Session),
	}
}

func (m *Manager) Bind(userID string, conn *websocket.Conn) {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.sessions[userID] = &Session{
		UserID: userID,
		Conn:   conn,
	}
}

func (m *Manager) Remove(userID string) {
	m.mu.Lock()
	defer m.mu.Unlock()
	delete(m.sessions, userID)
}

func (m *Manager) Get(userID string) *Session {
	m.mu.RLock()
	defer m.mu.RUnlock()
	return m.sessions[userID]
}
