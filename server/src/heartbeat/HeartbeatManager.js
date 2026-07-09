class HeartbeatManager {
  constructor(timeout = 60000) {
    this.timeout = timeout;
    this.clients = new Map();
  }

  register(userId) {
    this.clients.set(userId, Date.now());
  }

  refresh(userId) {
    if (this.clients.has(userId)) {
      this.clients.set(userId, Date.now());
    }
  }

  remove(userId) {
    this.clients.delete(userId);
  }

  expired() {
    const now = Date.now();
    const result = [];

    for (const [id, time] of this.clients) {
      if (now - time > this.timeout) {
        result.push(id);
      }
    }

    return result;
  }
}

module.exports = HeartbeatManager;
