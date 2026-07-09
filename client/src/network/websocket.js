class PetSocket {
  constructor(url) {
    this.url = url;
    this.ws = null;
    this.handlers = {};
  }

  connect() {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      this.emit('open');
    };

    this.ws.onmessage = event => {
      const msg = JSON.parse(event.data);
      this.emit(msg.type, msg);
    };

    this.ws.onclose = () => {
      this.emit('close');
    };
  }

  send(type, data = {}) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return;
    }

    this.ws.send(JSON.stringify({
      type,
      ...data
    }));
  }

  on(type, callback) {
    this.handlers[type] = callback;
  }

  emit(type, data) {
    if (this.handlers[type]) {
      this.handlers[type](data);
    }
  }
}

module.exports = PetSocket;
