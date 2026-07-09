class RoomManager {
  constructor() {
    this.rooms = new Map();
  }

  create(roomId, name) {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, {
        id: roomId,
        name: name || roomId,
        users: new Map()
      });
    }
    return this.rooms.get(roomId);
  }

  join(roomId, user) {
    const room = this.create(roomId, roomId);
    room.users.set(user.id, user);
  }

  leave(roomId, userId) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    room.users.delete(userId);

    if (room.users.size === 0) {
      this.rooms.delete(roomId);
    }
  }

  leaveAll(userId) {
    for (const room of this.rooms.values()) {
      room.users.delete(userId);
    }
  }

  users(roomId) {
    const room = this.rooms.get(roomId);
    if (!room) return [];

    return Array.from(room.users.values()).map(user => ({
      id: user.id,
      name: user.name
    }));
  }

  list() {
    return Array.from(this.rooms.values()).map(room => ({
      id: room.id,
      name: room.name,
      count: room.users.size
    }));
  }

  broadcast(roomId, message) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    for (const user of room.users.values()) {
      if (user.socket.readyState === 1) {
        user.socket.send(JSON.stringify(message));
      }
    }
  }
}

module.exports = RoomManager;
