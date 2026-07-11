const http = require('http');
const WebSocket = require('ws');
const UserManager = require('./user/UserManager');
const RoomManager = require('./room/RoomManager');
const PetManager = require('./pet/PetManager');
const validation = require('./validation');
const defaultConfig = require('./config');

const VERSION = require('../package.json').version;

function createServer(options = {}) {
  const config = { ...defaultConfig, ...options };
  const users = new UserManager();
  const rooms = new RoomManager();
  const pets = new PetManager();

  const httpServer = http.createServer((request, response) => {
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('Cache-Control', 'no-store');

    if (request.url === '/healthz') {
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ ok: true, version: VERSION }));
      return;
    }

    response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Desktop Pet Server is running');
  });

  const server = new WebSocket.Server({
    server: httpServer,
    maxPayload: config.maxPayload,
    verifyClient: ({ origin, req }) =>
      req.url === '/ws' &&
      (config.allowedOrigins.length === 0 || !origin || config.allowedOrigins.includes(origin))
  });

  function send(socket, message) {
    if (socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify(message));
  }

  function error(socket, code, message) {
    send(socket, { type: 'ERROR', code, message });
  }

  function broadcast(message) {
    for (const item of users.list()) {
      const user = users.get(item.id);
      if (user) send(user.socket, message);
    }
  }

  function syncOnlineUsers() {
    broadcast({ type: 'ONLINE_LIST', users: users.list() });
  }

  function syncRoomList() {
    broadcast({ type: 'ROOM_LIST', rooms: rooms.list() });
  }

  function syncRoomUsers(roomId) {
    if (!roomId) return;
    rooms.broadcast(roomId, { type: 'ROOM_USERS', roomId, users: rooms.users(roomId) });
  }

  function joinRoom(user, requestedRoomId) {
    const nextRoomId = validation.roomId(requestedRoomId, config.defaultRoom);
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
    socket.isAlive = true;
    socket.rateWindow = { startedAt: Date.now(), count: 0 };
    socket.on('pong', () => { socket.isAlive = true; });
    socket.on('error', socketError => {
      console.warn(`WebSocket error for user ${user.id}: ${socketError.message}`);
    });

    joinRoom(user, config.defaultRoom);
    send(socket, { type: 'WELCOME', user: users.list().find(item => item.id === user.id), pet, roomId: user.roomId });
    syncOnlineUsers();
    syncRoomList();

    socket.on('message', data => {
      const now = Date.now();
      if (now - socket.rateWindow.startedAt >= 10000) socket.rateWindow = { startedAt: now, count: 0 };
      socket.rateWindow.count += 1;
      if (socket.rateWindow.count > 60) {
        socket.close(1008, 'message rate exceeded');
        return;
      }

      let msg;
      try {
        msg = JSON.parse(data.toString());
      } catch {
        error(socket, 'INVALID_JSON', 'invalid JSON message');
        return;
      }

      if (!msg || typeof msg !== 'object' || typeof msg.type !== 'string') {
        error(socket, 'INVALID_MESSAGE', 'message type is required');
        return;
      }

      switch (msg.type) {
        case 'LOGIN':
          user.name = validation.username(msg.username || msg.nickname);
          syncOnlineUsers();
          syncRoomUsers(user.roomId);
          send(socket, { type: 'LOGIN_OK', user: { id: user.id, name: user.name, roomId: user.roomId } });
          break;

        case 'ROOM_CREATE':
        case 'ROOM_JOIN': {
          const nextRoomId = validation.roomId(msg.roomId, '');
          if (!nextRoomId) error(socket, 'INVALID_ROOM', 'room id must contain 1-32 letters, numbers, _ or -');
          else joinRoom(user, nextRoomId);
          break;
        }

        case 'CHAT': {
          const message = validation.chat(msg.message);
          if (!message) error(socket, 'INVALID_CHAT', 'chat message cannot be empty');
          else rooms.broadcast(user.roomId, {
            type: 'CHAT', roomId: user.roomId, userId: user.id,
            username: user.name, message, time: now
          });
          break;
        }

        case 'PET_UPDATE': {
          const state = validation.petState(msg.state);
          if (Object.keys(state).length === 0) error(socket, 'INVALID_PET_STATE', 'pet state has no supported fields');
          else rooms.broadcast(user.roomId, {
            type: 'PET_UPDATE', roomId: user.roomId, userId: user.id,
            pet: pets.update(user.id, state)
          });
          break;
        }

        case 'HEARTBEAT':
          socket.isAlive = true;
          send(socket, { type: 'HEARTBEAT_ACK', time: now });
          break;

        default:
          error(socket, 'UNSUPPORTED_MESSAGE', 'unsupported message type');
      }
    });

    socket.on('close', () => {
      const roomId = user.roomId;
      if (roomId) {
        rooms.leave(roomId, user.id);
        syncRoomUsers(roomId);
      }
      pets.remove(user.id);
      users.remove(user.id);
      syncOnlineUsers();
      syncRoomList();
    });
  });

  const heartbeatTimer = setInterval(() => {
    for (const socket of server.clients) {
      if (!socket.isAlive) {
        socket.terminate();
        continue;
      }
      socket.isAlive = false;
      socket.ping();
    }
  }, config.heartbeatInterval);
  heartbeatTimer.unref();

  httpServer.on('close', () => clearInterval(heartbeatTimer));

  return {
    httpServer,
    server,
    state: { users, rooms, pets },
    listen(callback) { return httpServer.listen(config.port, config.bindHost, callback); },
    close(callback) {
      for (const socket of server.clients) socket.close(1001, 'server shutting down');
      server.close(() => httpServer.close(callback));
    }
  };
}

if (require.main === module) {
  const app = createServer();
  app.listen(() => {
    const bindLabel = defaultConfig.bindHost || 'default';
    console.log(`Desktop Pet Server v${VERSION} listening on ${bindLabel}:${defaultConfig.port}`);
  });

  const shutdown = () => app.close(() => process.exit(0));
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

module.exports = { createServer };
