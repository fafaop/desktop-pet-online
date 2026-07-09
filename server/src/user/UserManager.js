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
      online: true,
      roomId: null
    };

    this.users.set(user.id, user);
    return user;
  }

  updateName(id, name) {
    const user = this.users.get(id);
    if (!user) return null;

    user.name = name || 'Guest';
    return user;
  }

  setRoom(id, roomId) {
    const user = this.users.get(id);
    if (user) {
      user.roomId = roomId;
    }
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
      online: user.online,
      roomId: user.roomId
    }));
  }

  count() {
    return this.users.size;
  }
}

module.exports = UserManager;
