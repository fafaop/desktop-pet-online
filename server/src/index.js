import { WebSocketServer } from 'ws';
import { handleMessage } from './message_handler.js';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
  let userId = null;

  ws.send(JSON.stringify({type:'WELCOME',message:'connected'}));

  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString());
      if (msg.type === 'LOGIN') {
        userId = msg.userId;
      }
      handleMessage(ws, data.toString());
    } catch (e) {
      ws.send(JSON.stringify({type:'ERROR',message:'invalid message'}));
    }
  });

  ws.on('close', () => {
    console.log('user disconnected', userId);
  });
});

console.log('Desktop Pet Online server running ws://localhost:8080');
