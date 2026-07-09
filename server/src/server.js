const WebSocket = require('ws');
const UserManager = require('./user/UserManager');
const RoomManager = require('./room/RoomManager');
const PetManager = require('./pet/PetManager');
const config = require('./config');

const server = new WebSocket.Server({ port: config.port });
const DEFAULT_ROOM_ID = config.defaultRoom;

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

function syncRoomList() {
  broadcast({
    type: 'ROOM_LIST',
    rooms: rooms.list()
  });
}

function syncRoomUsers(roomId) {
  if (!roomId) {
    return;
  }

  rooms.broadcast(roomId, {
    type: 'ROOM_USERS',
    roomId,
    users: rooms.users(roomId)
  });
}

function joinRoom(user, roomId) {
  const nextRoomId = roomId || DEFAULT_ROOM_ID;
  const previousRoomId = user.roomId;

  if (previousRoomId && previousRoomId !== nextRoomId) {
    rooms.leave(previousRoomId, user.id);
    syncRoomUsers(previousRoomId);
  }

  rooms.join(nextRoomId, user);
  users.setRoom(user.id, nextRoomId);
  syncRoomUsers(nextRoomId);
  syncRoomList();

  send(user.socket, {
    type: 'ROOM_JOINED',
    roomId: nextRoomId,
    users: rooms.users(nextRoomId),
    rooms: rooms.list()
  });
}

server.on('connection', socket => {
  const user = users.create(socket);
  const pet = pets.create(user.id);

  joinRoom(user, DEFAULT_ROOM_ID);

  send(socket, {
    type: 'WELCOME',
    user: users.list().find(u => u.id === user.id),
    pet,
    roomId: user.roomId
  });

  syncOnlineUsers();
  syncRoomList();

  socket.on('message', data => {
    try {
      const msg = JSON.parse(data.toString());

      switch (msg.type) {
        case 'LOGIN':
          user.name = msg.username || msg.nickname || 'Guest';
          syncOnlineUsers();
          syncRoomUsers(user.roomId);
          break;

        case 'ROOM_CREATE':
          rooms.create(msg.roomId || DEFAULT_ROOM_ID, msg.name);
          joinRoom(user, msg.roomId || DEFAULT_ROOM_ID);
          break;

        case 'ROOM_JOIN':
          joinRoom(user, msg.roomId || DEFAULT_ROOM_ID);
          break;

        case 'CHAT':
          rooms.broadcast(msg.roomId || user.roomId || DEFAULT_ROOM_ID, {
            type: 'CHAT',
            roomId: msg.roomId || user.roomId || DEFAULT_ROOM_ID,
            userId: user.id,
            username: user.name,
            message: msg.message || '',
            time: Date.now()
          });
          break;

        case 'PET_UPDATE':
          rooms.broadcast(msg.roomId || user.roomId || DEFAULT_ROOM_ID, {
            type: 'PET_UPDATE',
            roomId: msg.roomId || user.roomId || DEFAULT_ROOM_ID,
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
    const roomId = user.roomId;

    if (roomId) {
      rooms.leave(roomId, user.id);
      syncRoomUsers(roomId);
    }

    users.remove(user.id);
    syncOnlineUsers();
    syncRoomList();
  });
});

console.log(`Desktop Pet Server running on ws://${config.host}:${config.port}`);
