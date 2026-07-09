import { addUser, removeUser, broadcast } from './user_manager.js';

export function handleMessage(ws, raw) {
  let msg;
  try {
    msg = JSON.parse(raw);
  } catch (e) {
    return;
  }

  switch (msg.type) {
    case 'LOGIN':
      addUser(msg.userId, ws);
      broadcast({
        type: 'ONLINE_LIST',
        users: [msg.userId]
      });
      break;

    case 'CHAT_MESSAGE':
      broadcast(msg);
      break;

    case 'PET_STATE':
      broadcast(msg);
      break;

    case 'HEARTBEAT':
      ws.send(JSON.stringify({type:'HEARTBEAT_ACK'}));
      break;
  }
}

export function handleClose(userId) {
  removeUser(userId);
}
