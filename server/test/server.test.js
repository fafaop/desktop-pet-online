const test = require('node:test');
const assert = require('node:assert/strict');
const WebSocket = require('ws');
const { createServer } = require('../src/server');

function openClient(url) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(url);
    const messages = [];
    ws.on('message', raw => messages.push(JSON.parse(raw.toString())));
    ws.once('open', () => resolve({ ws, messages }));
    ws.once('error', reject);
  });
}

function waitFor(client, predicate, timeout = 2000) {
  return new Promise((resolve, reject) => {
    const existing = client.messages.find(predicate);
    if (existing) return resolve(existing);
    const timer = setTimeout(() => { cleanup(); reject(new Error('message timeout')); }, timeout);
    const listener = raw => {
      const message = JSON.parse(raw.toString());
      if (predicate(message)) { cleanup(); resolve(message); }
    };
    const cleanup = () => { clearTimeout(timer); client.ws.off('message', listener); };
    client.ws.on('message', listener);
  });
}

function send(client, message) { client.ws.send(JSON.stringify(message)); }

test('health, room isolation and server-owned routing work', async t => {
  const app = createServer({ port: 0, bindHost: '127.0.0.1', heartbeatInterval: 1000 });
  await new Promise(resolve => app.listen(resolve));
  t.after(() => new Promise(resolve => app.close(resolve)));
  const address = app.httpServer.address();
  const url = `ws://127.0.0.1:${address.port}/ws`;

  const health = await fetch(`http://127.0.0.1:${address.port}/healthz`).then(response => response.json());
  assert.equal(health.ok, true);

  await assert.rejects(openClient(`ws://127.0.0.1:${address.port}/`));

  const a = await openClient(url);
  const b = await openClient(url);
  const c = await openClient(url);
  t.after(() => { a.ws.close(); b.ws.close(); c.ws.close(); });
  await Promise.all([a, b, c].map(client => waitFor(client, message => message.type === 'WELCOME')));

  send(a, { type: 'LOGIN', username: 'Alice' });
  send(b, { type: 'LOGIN', username: 'Bob' });
  send(c, { type: 'LOGIN', username: 'Carol' });
  send(a, { type: 'ROOM_JOIN', roomId: 'same' });
  send(b, { type: 'ROOM_JOIN', roomId: 'same' });
  send(c, { type: 'ROOM_JOIN', roomId: 'other' });
  await Promise.all([
    waitFor(a, message => message.type === 'ROOM_JOINED' && message.roomId === 'same'),
    waitFor(b, message => message.type === 'ROOM_JOINED' && message.roomId === 'same'),
    waitFor(c, message => message.type === 'ROOM_JOINED' && message.roomId === 'other')
  ]);

  send(a, { type: 'CHAT', roomId: 'other', message: '<img onerror=boom>' });
  const received = await waitFor(b, message => message.type === 'CHAT' && message.userId === '1');
  assert.equal(received.roomId, 'same');
  assert.equal(received.message, '<img onerror=boom>');
  await new Promise(resolve => setTimeout(resolve, 100));
  assert.equal(c.messages.some(message => message.type === 'CHAT'), false);

  send(a, { type: 'PET_UPDATE', state: { owner: 'victim', mood: 999 } });
  const pet = await waitFor(b, message => message.type === 'PET_UPDATE');
  assert.equal(pet.pet.mood, 100);
  assert.equal(pet.pet.owner, '1');
});
