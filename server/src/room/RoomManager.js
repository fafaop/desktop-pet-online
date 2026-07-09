class RoomManager {
  constructor() {
    this.rooms = new Map();
  }

  join(roomId, user) {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Map());
    }

    this.rooms.get(roomId).set(user.id, user);
  }

  leave(roomId, userId) {
    const room = this.rooms.get(roomId);
    if (room) {
      room.delete(userId);
    }
  }

  broadcast(roomId, message) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    for (const user of room.values()) {
      if (user.socket.readyState === 1) {
        user.socket.send(JSON.stringify(message));
      }
    }
  }
}

module.exports = RoomManager;
