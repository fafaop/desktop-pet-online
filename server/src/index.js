import { WebSocketServer } from 'ws';
import { handleMessage } from './message_handler.js';
import UserManager from './user/UserManager.js';
import RoomManager from './room/RoomManager.js';
import MessageHandler from './message/MessageHandler.js';
import PetSyncManager from './pet/PetSyncManager.js';
import Heartbeat from './core/Heartbeat.js';

const wss = new WebSocketServer({ port: 8080 });

const users = new UserManager();
const rooms = new RoomManager();
const messageHandler = new MessageHandler(rooms);
const petSyncManager = new PetSyncManager(rooms);
const heartbeat = new Heartbeat();

wss.on('connection', (ws) => {
  heartbeat.start(ws);

  const user = users.create(ws);

  ws.send(JSON.stringify({
    type: 'WELCOME',
    data: { userId: user.id }
  }));

  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString());

      if (msg.type === 'pet_update') {
        petSyncManager.update(user.id, msg.roomId, msg.data);
        return;
      }

      messageHandler.handle(user, msg);
      handleMessage(ws, data.toString());
    } catch (e) {
      ws.send(JSON.stringify({type:'ERROR',message:'invalid message'}));
    }
  });

  ws.on('close', () => {
    users.remove(user.id);
  });
});

console.log('Desktop Pet Online server running ws://localhost:8080');
