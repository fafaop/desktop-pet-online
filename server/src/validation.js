const LIMITS = Object.freeze({
  username: 24,
  roomId: 32,
  chat: 500
});

function cleanText(value, maxLength) {
  if (typeof value !== 'string') return '';
  return value.replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, maxLength);
}

function username(value) {
  return cleanText(value, LIMITS.username) || 'Guest';
}

function roomId(value, fallback = 'lobby') {
  const clean = cleanText(value, LIMITS.roomId);
  return /^[A-Za-z0-9_-]+$/.test(clean) ? clean : fallback;
}

function chat(value) {
  return cleanText(value, LIMITS.chat);
}

function petState(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};

  const state = {};
  if (Number.isFinite(value.mood)) state.mood = Math.max(0, Math.min(100, Math.round(value.mood)));
  if (Number.isFinite(value.hunger)) state.hunger = Math.max(0, Math.min(100, Math.round(value.hunger)));
  if (['idle', 'walk', 'sleep', 'happy'].includes(value.action)) state.action = value.action;

  if (value.position && Number.isFinite(value.position.x) && Number.isFinite(value.position.y)) {
    state.position = {
      x: Math.max(-10000, Math.min(10000, Math.round(value.position.x))),
      y: Math.max(-10000, Math.min(10000, Math.round(value.position.y)))
    };
  }

  return state;
}

module.exports = { LIMITS, username, roomId, chat, petState };
