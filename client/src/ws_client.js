export class PetSocket {
  constructor(url) {
    this.ws = new WebSocket(url);
    this.handlers = {};

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      const handler = this.handlers[msg.type];
      if (handler) handler(msg);
    };
  }

  on(type, callback) {
    this.handlers[type] = callback;
  }

  send(data) {
    this.ws.send(JSON.stringify(data));
  }
}
