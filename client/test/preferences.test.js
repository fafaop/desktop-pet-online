const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {
  DEFAULTS, validateServerUrl, sanitizePreferences, loadPreferences, savePreferences
} = require('../src/preferences');

test('accepts only credential-free WebSocket server URLs', () => {
  assert.equal(validateServerUrl('wss://pet.example.com/ws'), 'wss://pet.example.com/ws');
  assert.equal(validateServerUrl('ws://localhost:8080/'), 'ws://localhost:8080');
  assert.equal(validateServerUrl('https://example.com'), DEFAULTS.serverUrl);
  assert.equal(validateServerUrl('wss://user:secret@example.com'), DEFAULTS.serverUrl);
  assert.equal(validateServerUrl('not-a-url'), DEFAULTS.serverUrl);
});

test('sanitizes and atomically persists preferences', t => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'desktop-pet-preferences-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const file = path.join(directory, 'preferences.json');
  const saved = savePreferences(file, {
    serverUrl: 'wss://pet.example.com/socket',
    nickname: '  Alice\n  ',
    roomId: '../invalid'
  });
  assert.deepEqual(saved, {
    serverUrl: 'wss://pet.example.com/socket', nickname: 'Alice', roomId: 'lobby',
    petPosition: null, movementPaused: false
  });
  assert.deepEqual(loadPreferences(file), saved);
  assert.equal(fs.existsSync(`${file}.tmp`), false);
  const moved = savePreferences(file, {
    ...saved, roomId: 'second', petPosition: { x: 250.4, y: -30.6 }, movementPaused: true
  });
  assert.equal(moved.roomId, 'second');
  assert.deepEqual(loadPreferences(file).petPosition, { x: 250, y: -31 });
  assert.equal(loadPreferences(file).movementPaused, true);
  fs.writeFileSync(file, `\uFEFF${JSON.stringify(saved)}`);
  assert.deepEqual(loadPreferences(file), saved);
  assert.deepEqual(sanitizePreferences(null), DEFAULTS);
});
