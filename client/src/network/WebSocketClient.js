class WebSocketClient {
  constructor(url) {
    this.url = url;
    this.socket = null;
    this.handlers = {};
  }

  connect() {
    this.socket = new WebSocket(this.url);

    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const handler = this.handlers[message.type];
      if (handler) {
        handler(message);
      }
    };
  }

  send(type, data = {}) {
    if (!this.socket) return;

    this.socket.send(JSON.stringify({
      type,
      data,
      timestamp: Date.now()
    }));
  }

  on(type, callback) {
    this.handlers[type] = callback;
  }
}

module.exports = WebSocketClient;
