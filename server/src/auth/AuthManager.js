class AuthManager {
  constructor() {
    this.sessions = new Map();
  }

  login(userId, username) {
    const session = {
      userId,
      username: username || 'Guest',
      loginTime: Date.now()
    };

    this.sessions.set(userId, session);
    return session;
  }

  logout(userId) {
    this.sessions.delete(userId);
  }

  get(userId) {
    return this.sessions.get(userId);
  }
}

module.exports = AuthManager;
