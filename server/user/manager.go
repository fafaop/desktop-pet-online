package user

import "sync"

// Manager manages online users.
type Manager struct {
	users map[string]*User
	mu    sync.RWMutex
}

func NewManager() *Manager {
	return &Manager{
		users: make(map[string]*User),
	}
}

func (m *Manager) Add(user *User) {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.users[user.ID] = user
}

func (m *Manager) Remove(id string) {
	m.mu.Lock()
	defer m.mu.Unlock()
	delete(m.users, id)
}

func (m *Manager) Get(id string) *User {
	m.mu.RLock()
	defer m.mu.RUnlock()
	return m.users[id]
}

func (m *Manager) Count() int {
	m.mu.RLock()
	defer m.mu.RUnlock()
	return len(m.users)
}
