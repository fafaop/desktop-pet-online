class PetSyncManager {
  constructor(roomManager) {
    this.roomManager = roomManager;
    this.petStates = new Map();
  }

  update(userId, roomId, state) {
    this.petStates.set(userId, state);

    this.roomManager.broadcast(roomId, {
      type: 'pet_update',
      userId,
      data: state,
      timestamp: Date.now()
    });
  }

  get(userId) {
    return this.petStates.get(userId);
  }
}

module.exports = PetSyncManager;
