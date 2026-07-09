package gateway

import "sync"

// Registry manages online sessions.
type Registry struct {
	mu       sync.RWMutex
	sessions map[int64]*ClientSession
}

func NewRegistry() *Registry {
	return &Registry{sessions: make(map[int64]*ClientSession)}
}

func (r *Registry) Bind(userID int64, session *ClientSession) {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.sessions[userID] = session
}

func (r *Registry) Find(userID int64) *ClientSession {
	r.mu.RLock()
	defer r.mu.RUnlock()
	return r.sessions[userID]
}
