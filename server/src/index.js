import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });
const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  ws.send(JSON.stringify({type:'welcome',message:'connected'}));
  ws.on('message', (msg) => {
    for (const c of clients) c.send(msg.toString());
  });
  ws.on('close', () => clients.delete(ws));
});

console.log('Desktop Pet demo server: ws://localhost:8080');
