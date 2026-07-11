const fs = require('node:fs');
const path = require('node:path');

const DEFAULTS = Object.freeze({
  serverUrl: 'ws://localhost:8080/ws',
  nickname: 'Guest',
  roomId: 'lobby',
  petPosition: null,
  movementPaused: false
});

function validateServerUrl(value, fallback = DEFAULTS.serverUrl) {
  if (typeof value !== 'string' || value.length > 2048) return fallback;
  try {
    const url = new URL(value.trim());
    if (!['ws:', 'wss:'].includes(url.protocol) || !url.hostname || url.username || url.password) return fallback;
    url.hash = '';
    return url.toString().replace(/\/$/, '');
  } catch {
    return fallback;
  }
}

function sanitizePreferences(value = {}, defaults = DEFAULTS) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) value = {};
  const nickname = typeof value.nickname === 'string'
    ? value.nickname.replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, 24)
    : '';
  const candidateRoom = typeof value.roomId === 'string' ? value.roomId.trim().slice(0, 32) : '';
  const candidatePosition = value.petPosition;
  const petPosition = candidatePosition && Number.isFinite(candidatePosition.x) && Number.isFinite(candidatePosition.y)
    ? {
        x: Math.max(-100000, Math.min(100000, Math.round(candidatePosition.x))),
        y: Math.max(-100000, Math.min(100000, Math.round(candidatePosition.y)))
      }
    : (defaults.petPosition || null);
  return {
    serverUrl: validateServerUrl(value.serverUrl, defaults.serverUrl),
    nickname: nickname || defaults.nickname,
    roomId: /^[A-Za-z0-9_-]+$/.test(candidateRoom) ? candidateRoom : defaults.roomId,
    petPosition,
    movementPaused: typeof value.movementPaused === 'boolean'
      ? value.movementPaused
      : Boolean(defaults.movementPaused)
  };
}

function loadPreferences(file, defaults = DEFAULTS) {
  try {
    const content = fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
    return sanitizePreferences(JSON.parse(content), defaults);
  } catch {
    return { ...defaults };
  }
}

function savePreferences(file, value, defaults = DEFAULTS) {
  const preferences = sanitizePreferences(value, defaults);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temporary = `${file}.tmp`;
  fs.writeFileSync(temporary, `${JSON.stringify(preferences, null, 2)}\n`, { mode: 0o600 });
  fs.renameSync(temporary, file);
  return preferences;
}

module.exports = { DEFAULTS, validateServerUrl, sanitizePreferences, loadPreferences, savePreferences };
