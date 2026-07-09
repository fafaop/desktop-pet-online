const WebSocket = require('ws');
const UserManager = require('./user/UserManager');
const RoomManager = require('./room/RoomManager');
const PetManager = require('./pet/PetManager');

const server = new WebSocket.Server({ port: 8080 });

const users = new UserManager();
const rooms = new RoomManager();
const pets = new PetManager();

function send(socket, message) {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  }
}

function broadcast(message) {
  users.list().forEach(item => {
    const user = users.get(item.id);
    if (user) send(user.socket, message);
  });
}

server.on('connection', socket => {
  const user = users.create(socket);
  const pet = pets.create(user.id);

  send(socket, { type: 'WELCOME', user, pet });

  broadcast({
    type: 'ONLINE_COUNT',
    count: users.count()
  });

  socket.on('message', data => {
    try {
      const msg = JSON.parse(data.toString());

      switch (msg.type) {
        case 'LOGIN':
          user.name = msg.username || 'Guest';
          broadcast({
            type: 'USER_UPDATE',
            user: {
              id: user.id,
              name: user.name
            }
          });
          break;

        case 'ROOM_JOIN':
          rooms.join(msg.roomId || 'default', user);
          send(socket, {
            type: 'ROOM_JOINED',
            roomId: msg.roomId || 'default'
          });
          break;

        case 'CHAT':
          rooms.broadcast(msg.roomId || 'default', {
            type: 'CHAT',
            userId: user.id,
            username: user.name,
            message: msg.message || '',
            time: Date.now()
          });
          break;

        case 'PET_UPDATE':
          broadcast({
            type: 'PET_UPDATE',
            userId: user.id,
            pet: pets.update(user.id, msg.state || {})
          });
          break;

        case 'HEARTBEAT':
          send(socket, { type: 'HEARTBEAT_ACK' });
          break;
      }
    } catch (e) {
      send(socket, {
        type: 'ERROR',
        message: 'invalid message'
      });
    }
  });

  socket.on('close', () => {
    users.remove(user.id);
    broadcast({
      type: 'ONLINE_COUNT',
      count: users.count()
    });
  });
});

console.log('Desktop Pet Server running on ws://localhost:8080');
