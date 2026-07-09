class UserManager {
  constructor() {
    this.users = new Map();
    this.sequence = 1;
  }

  create(socket, name) {
    const user = {
      id: String(this.sequence++),
      name: name || 'Guest',
      socket,
      online: true
    };

    this.users.set(user.id, user);
    return user;
  }

  remove(id) {
    this.users.delete(id);
  }

  get(id) {
    return this.users.get(id);
  }

  list() {
    return Array.from(this.users.values()).map(user => ({
      id: user.id,
      name: user.name,
      online: user.online
    }));
  }

  count() {
    return this.users.size;
  }
}

module.exports = UserManager;
