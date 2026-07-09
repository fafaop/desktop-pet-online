const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });
const users = new Map();

function broadcast(message) {
  for (const client of users.values()) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  }
}

server.on('connection', socket => {
  const id = Date.now().toString();
  users.set(id, socket);

  socket.send(JSON.stringify({
    type: 'WELCOME',
    userId: id
  }));

  broadcast({
    type: 'ONLINE_COUNT',
    count: users.size
  });

  socket.on('message', data => {
    try {
      const msg = JSON.parse(data.toString());

      if (msg.type === 'CHAT') {
        broadcast({
          type: 'CHAT',
          userId: id,
          message: msg.message,
          time: Date.now()
        });
      }
    } catch (e) {
      socket.send(JSON.stringify({
        type: 'ERROR',
        message: 'invalid message'
      }));
    }
  });

  socket.on('close', () => {
    users.delete(id);
    broadcast({
      type: 'ONLINE_COUNT',
      count: users.size
    });
  });
});

console.log('Desktop Pet Server running on ws://localhost:8080');
