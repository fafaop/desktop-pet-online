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

function syncOnlineUsers() {
  broadcast({
    type: 'ONLINE_LIST',
    users: users.list()
  });
}

server.on('connection', socket => {
  const user = users.create(socket);
  const pet = pets.create(user.id);

  send(socket, {
    type: 'WELCOME',
    user: users.list().find(u => u.id === user.id),
    pet
  });

  syncOnlineUsers();

  socket.on('message', data => {
    try {
      const msg = JSON.parse(data.toString());

      switch (msg.type) {
        case 'LOGIN':
          user.name = msg.username || 'Guest';
          syncOnlineUsers();
          break;

        case 'ROOM_CREATE':
          rooms.create(msg.roomId || 'default', msg.name);
          send(socket, { type: 'ROOM_LIST', rooms: rooms.list() });
          break;

        case 'ROOM_JOIN': {
          const roomId = msg.roomId || 'default';
          rooms.join(roomId, user);
          rooms.broadcast(roomId, {
            type: 'ROOM_USERS',
            users: rooms.users(roomId)
          });
          break;
        }

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
          send(socket, { type: 'HEARTBEAT_ACK', time: Date.now() });
          break;

        default:
          send(socket, { type: 'ERROR', message: 'unsupported message' });
      }
    } catch (e) {
      send(socket, { type: 'ERROR', message: 'invalid message' });
    }
  });

  socket.on('close', () => {
    rooms.leaveAll(user.id);
    users.remove(user.id);
    syncOnlineUsers();
  });
});

console.log('Desktop Pet Server running on ws://localhost:8080');
