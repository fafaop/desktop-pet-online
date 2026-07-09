class UserManager {
  constructor() {
    this.users = new Map();
    this.sequence = 1;
  }

  create(socket) {
    const user = {
      id: String(this.sequence++),
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
}

module.exports = UserManager;
