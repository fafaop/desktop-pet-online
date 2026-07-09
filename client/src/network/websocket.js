class PetSocket {
  constructor(url) {
    this.url = url;
    this.ws = null;
    this.handlers = {};
    this.retry = 0;
  }

  connect() {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      this.retry = 0;
      this.emit('open');
    };

    this.ws.onmessage = event => {
      try {
        const msg = JSON.parse(event.data);
        this.emit(msg.type, msg);
      } catch (e) {
        this.emit('error', { message: 'invalid server message' });
      }
    };

    this.ws.onerror = error => {
      this.emit('error', error);
    };

    this.ws.onclose = () => {
      this.emit('close');
      this.reconnect();
    };
  }

  reconnect() {
    if (this.retry >= 5) return;

    this.retry++;
    setTimeout(() => this.connect(), this.retry * 2000);
  }

  send(type, data = {}) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return false;
    }

    this.ws.send(JSON.stringify({
      type,
      ...data
    }));

    return true;
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
