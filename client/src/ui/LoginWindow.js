class LoginWindow {
  constructor(network) {
    this.network = network;
    this.userId = null;
  }

  login(name) {
    this.network.send('LOGIN', {
      nickname: name
    });
  }

  onWelcome(message) {
    this.userId = message.data.userId;
  }
}

module.exports = LoginWindow;
