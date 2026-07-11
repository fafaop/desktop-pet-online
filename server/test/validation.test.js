const test = require('node:test');
const assert = require('node:assert/strict');
const validation = require('../src/validation');

test('normalizes public input', () => {
  assert.equal(validation.username('  Alice\n<script>  '), 'Alice<script>');
  assert.equal(validation.username(''), 'Guest');
  assert.equal(validation.roomId('room-_12'), 'room-_12');
  assert.equal(validation.roomId('../admin', 'lobby'), 'lobby');
  assert.equal(validation.chat('  hello\u0000 world  '), 'hello world');
});

test('pet state only accepts bounded public fields', () => {
  assert.deepEqual(validation.petState({
    id: 'hijack', owner: 'other', mood: 150, hunger: -2.4,
    action: 'walk', position: { x: 12000, y: -12000 }, injected: true
  }), {
    mood: 100, hunger: 0, action: 'walk', position: { x: 10000, y: -10000 }
  });
});
