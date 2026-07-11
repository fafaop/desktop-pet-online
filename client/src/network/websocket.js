class PetSocket {
  constructor(url) {
    this.url = url;
    this.ws = null;
    this.handlers = new Map();
    this.retry = 0;
    this.reconnectTimer = null;
    this.heartbeatTimer = null;
    this.closedByUser = false;
  }

  connect() {
    if (this.ws && [WebSocket.OPEN, WebSocket.CONNECTING].includes(this.ws.readyState)) return;
    this.closedByUser = false;
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      this.retry = 0;
      this.startHeartbeat();
      this.emit('open');
    };

    this.ws.onmessage = event => {
      try {
        const msg = JSON.parse(event.data);
        this.emit(msg.type, msg);
      } catch {
        this.emit('error', { message: 'Invalid server message' });
      }
    };

    this.ws.onerror = () => this.emit('error', { message: 'Connection error' });
    this.ws.onclose = () => {
      this.stopHeartbeat();
      this.ws = null;
      this.emit('close');
      if (!this.closedByUser) this.reconnect();
    };
  }

  reconnect() {
    clearTimeout(this.reconnectTimer);
    const delay = Math.min(30000, 1000 * (2 ** Math.min(this.retry++, 5)));
    this.emit('reconnecting', { delay });
    this.reconnectTimer = setTimeout(() => this.connect(), delay);
  }

  startHeartbeat() {
    this.stopHeartbeat();
    this.heartbeatTimer = setInterval(() => this.send('HEARTBEAT'), 20000);
  }

  stopHeartbeat() {
    clearInterval(this.heartbeatTimer);
    this.heartbeatTimer = null;
  }

  send(type, data = {}) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return false;
    this.ws.send(JSON.stringify({ type, ...data }));
    return true;
  }

  on(type, callback) {
    if (!this.handlers.has(type)) this.handlers.set(type, new Set());
    this.handlers.get(type).add(callback);
    return () => this.handlers.get(type)?.delete(callback);
  }

  emit(type, data) {
    for (const callback of this.handlers.get(type) || []) callback(data);
  }

  close() {
    this.closedByUser = true;
    clearTimeout(this.reconnectTimer);
    this.stopHeartbeat();
    this.ws?.close(1000, 'client closing');
  }
}

module.exports = PetSocket;
