class Heartbeat {
  constructor(socket, interval = 30000) {
    this.socket = socket;
    this.interval = interval;
    this.timer = null;
  }

  start() {
    this.stop();
    this.timer = setInterval(() => {
      this.socket.send('HEARTBEAT');
    }, this.interval);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

module.exports = Heartbeat;
