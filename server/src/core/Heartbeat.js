class Heartbeat {
  constructor(interval = 30000) {
    this.interval = interval;
  }

  start(socket) {
    socket.isAlive = true;

    socket.on('pong', () => {
      socket.isAlive = true;
    });

    const timer = setInterval(() => {
      if (!socket.isAlive) {
        clearInterval(timer);
        socket.terminate();
        return;
      }

      socket.isAlive = false;
      socket.ping();
    }, this.interval);

    return timer;
  }
}

module.exports = Heartbeat;
