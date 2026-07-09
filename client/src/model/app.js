class AppState {
  constructor() {
    this.user = null;
    this.pet = null;
    this.roomId = null;
    this.onlineCount = 0;
  }

  setUser(user) {
    this.user = user;
  }

  setPet(pet) {
    this.pet = pet;
  }

  joinRoom(roomId) {
    this.roomId = roomId;
  }
}

module.exports = new AppState();
