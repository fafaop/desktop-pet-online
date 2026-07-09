class RoomModel {
  constructor() {
    this.id = null;
    this.users = [];
    this.messages = [];
  }

  join(id) {
    this.id = id;
  }

  addUser(user) {
    this.users.push(user);
  }

  addMessage(message) {
    this.messages.push(message);
  }
}

module.exports = RoomModel;
