package gateway

import "sync"

// Connection represents a client session.
type Connection struct {
	ID     string
	UserID int64
}

// ConnectionManager manages active sessions.
type ConnectionManager struct {
	connections map[string]*Connection
	mutex       sync.RWMutex
}

func NewConnectionManager() *ConnectionManager {
	return &ConnectionManager{
		connections: make(map[string]*Connection),
	}
}

func (m *ConnectionManager) Add(conn *Connection) {
	m.mutex.Lock()
	defer m.mutex.Unlock()
	m.connections[conn.ID] = conn
}

func (m *ConnectionManager) Remove(id string) {
	m.mutex.Lock()
	defer m.mutex.Unlock()
	delete(m.connections, id)
}
