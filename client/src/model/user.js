class User {
  constructor(id, name) {
    this.id = id;
    this.name = name || 'Guest';
    this.online = true;
  }
}

module.exports = User;
