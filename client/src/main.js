const { app, BrowserWindow, ipcMain, session, screen } = require('electron');
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const PetSocket = require('./Network/websocket');
const config = require('./config');
const { loadPreferences, savePreferences } = require('./preferences');

const hasSingleInstanceLock = app.requestSingleInstanceLock();

function writeStartupError(error) {
  try {
    const directory = app.getPath('userData');
    fs.mkdirSync(directory, { recursive: true });
    fs.appendFileSync(
      path.join(directory, 'startup-error.log'),
      `[${new Date().toISOString()}] ${error?.stack || error}\n`
    );
  } catch {
    // There is no safe recovery path when even the diagnostics directory is unavailable.
  }
}

process.on('uncaughtException', error => {
  writeStartupError(error);
  app.exit(1);
});
process.on('unhandledRejection', writeStartupError);

let win = null;
let petWin = null;
let socket = null;
let currentUserId = null;
let currentRoomId = 'lobby';
let profile = { name: 'Guest' };
let preferences = { serverUrl: config.wsUrl, nickname: 'Guest', roomId: 'lobby', petPosition: null, movementPaused: false };
let preferencesFile = null;
let petState = { name: 'Mimi', level: 1, mood: 80, hunger: 20, action: 'idle', position: { x: 0, y: 0 }, online: false };
let movementPaused = false;
let movementTimer = null;
let animationTimer = null;
let dragOffset = null;

const PET_WINDOW_SIZE = Object.freeze({ width: 280, height: 300 });
const INTERACTIONS = Object.freeze({
  feed: { hunger: -20, mood: 8, action: 'happy', feedback: 'Yum! Thank you!' },
  play: { hunger: 6, mood: 16, action: 'happy', feedback: 'That was fun!' },
  pet: { hunger: 0, mood: 12, action: 'happy', feedback: 'Hehe... more head pats!' },
  rest: { hunger: 2, mood: 5, action: 'sleep', feedback: 'Nap time... zzz' }
});

function sendToRenderer(channel, data) {
  if (win && !win.isDestroyed()) win.webContents.send(channel, data);
}

function sendToPet(channel, data) {
  if (petWin && !petWin.isDestroyed()) petWin.webContents.send(channel, data);
}

function isAllowedSender(event, ...windows) {
  return windows.some(window => window && !window.isDestroyed() && event.sender === window.webContents);
}

function requireAllowedSender(event, ...windows) {
  if (!isAllowedSender(event, ...windows)) throw new Error('IPC sender is not allowed');
}

function copyPetState() {
  return { ...petState, position: { ...petState.position } };
}

function syncPetState() {
  // Pet interactions remain useful offline; network sync is best-effort.
  socket?.send('PET_UPDATE', { state: copyPetState() });
  sendToRenderer('pet:state', copyPetState());
  sendToPet('pet:state', copyPetState());
}

function clampPetPosition(x, y) {
  const currentBounds = petWin?.getBounds() || PET_WINDOW_SIZE;
  const bounds = { x: Math.round(x), y: Math.round(y), width: currentBounds.width, height: currentBounds.height };
  const display = screen.getDisplayMatching(bounds);
  const area = display.workArea;
  return {
    x: Math.round(Math.max(area.x, Math.min(x, area.x + area.width - bounds.width))),
    y: Math.round(Math.max(area.y, Math.min(y, area.y + area.height - bounds.height)))
  };
}

function setPetWindowPosition(x, y, sync = false) {
  if (!petWin || petWin.isDestroyed() || !Number.isFinite(x) || !Number.isFinite(y)) return;
  const position = clampPetPosition(x, y);
  petWin.setPosition(position.x, position.y, false);
  petState.position = position;
  if (sync) syncPetState();
}

function stopPetAnimation() {
  if (animationTimer) clearInterval(animationTimer);
  animationTimer = null;
}

function schedulePetWalk(delay = 2500) {
  if (movementTimer) clearTimeout(movementTimer);
  movementTimer = setTimeout(startPetWalk, delay);
}

function startPetWalk() {
  if (movementPaused || dragOffset || !petWin || petWin.isDestroyed()) return;
  const from = petWin.getPosition();
  const bounds = petWin.getBounds();
  const displays = screen.getAllDisplays();
  const currentDisplay = screen.getDisplayMatching(bounds);
  const targetDisplay = displays.length > 1 && Math.random() < 0.18
    ? displays[Math.floor(Math.random() * displays.length)]
    : currentDisplay;
  const area = targetDisplay.workArea;
  const target = clampPetPosition(
    area.x + Math.random() * Math.max(1, area.width - bounds.width),
    area.y + Math.random() * Math.max(1, area.height - bounds.height)
  );
  const distance = Math.hypot(target.x - from[0], target.y - from[1]);
  const duration = Math.max(1800, Math.min(6500, distance * 7));
  const started = Date.now();
  petState.action = 'walk';
  sendToPet('pet:state', copyPetState());
  stopPetAnimation();
  animationTimer = setInterval(() => {
    const progress = Math.min(1, (Date.now() - started) / duration);
    const eased = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    setPetWindowPosition(
      from[0] + (target.x - from[0]) * eased,
      from[1] + (target.y - from[1]) * eased
    );
    if (progress >= 1) {
      stopPetAnimation();
      petState.action = 'idle';
      syncPetState();
      schedulePetWalk(4000 + Math.random() * 6500);
    }
  }, 40);
}

function setMovementPaused(paused) {
  movementPaused = Boolean(paused);
  preferences.movementPaused = movementPaused;
  stopPetAnimation();
  if (movementTimer) clearTimeout(movementTimer);
  movementTimer = null;
  if (petState.action === 'walk') petState.action = 'idle';
  sendToPet('movement:state', { paused: movementPaused });
  sendToRenderer('movement:state', { paused: movementPaused });
  if (!movementPaused) schedulePetWalk(1200);
  persistPreferences();
  return { paused: movementPaused };
}

function interactWithPet(kind) {
  const interaction = INTERACTIONS[kind];
  if (!interaction) return copyPetState();
  petState.hunger = Math.max(0, Math.min(100, petState.hunger + interaction.hunger));
  petState.mood = Math.max(0, Math.min(100, petState.mood + interaction.mood));
  petState.action = interaction.action;
  syncPetState();
  sendToPet('pet:feedback', { kind, message: interaction.feedback });
  setTimeout(() => {
    if (petState.action === interaction.action) {
      petState.action = 'idle';
      syncPetState();
    }
  }, kind === 'rest' ? 8000 : 2200);
  return copyPetState();
}

function persistPreferences() {
  if (!preferencesFile) return;
  preferences = savePreferences(preferencesFile, {
    ...preferences,
    nickname: profile.name,
    roomId: currentRoomId,
    petPosition: { ...petState.position },
    movementPaused
  }, { serverUrl: config.wsUrl, nickname: 'Guest', roomId: 'lobby', petPosition: null, movementPaused: false });
}

function sendMessage(type, data) {
  const sent = socket?.send(type, data) || false;
  if (!sent) sendToRenderer('app:error', { message: 'Not connected to the server yet' });
  return sent;
}

function connectSocket() {
  const activeSocket = new PetSocket(preferences.serverUrl);
  socket = activeSocket;
  const isCurrent = () => socket === activeSocket;

  activeSocket.on('open', () => {
    if (isCurrent()) sendToRenderer('connection:update', { status: 'connected' });
  });
  activeSocket.on('reconnecting', ({ delay }) => {
    if (isCurrent()) sendToRenderer('connection:update', { status: 'reconnecting', delay });
  });
  activeSocket.on('close', () => {
    if (!isCurrent()) return;
    petState.online = false;
    sendToRenderer('connection:update', { status: 'offline' });
  });
  activeSocket.on('error', error => {
    if (isCurrent()) sendToRenderer('app:error', { message: error.message || 'Network error' });
  });

  activeSocket.on('WELCOME', msg => {
    if (!isCurrent()) return;
    const desiredRoomId = currentRoomId;
    currentUserId = msg.user?.id || null;
    petState = { ...petState, ...msg.pet, online: true };
    sendToPet('pet:state', copyPetState());
    currentRoomId = msg.roomId || desiredRoomId;
    activeSocket.send('LOGIN', { username: profile.name });
    if (desiredRoomId && desiredRoomId !== msg.roomId) {
      currentRoomId = desiredRoomId;
      activeSocket.send('ROOM_JOIN', { roomId: desiredRoomId });
    }
    sendToRenderer('room:joined', { roomId: currentRoomId, users: [] });
    sendToRenderer('connection:update', { status: 'connected' });
  });

  activeSocket.on('LOGIN_OK', msg => { if (isCurrent()) sendToRenderer('login:ok', msg); });
  activeSocket.on('PET_UPDATE', msg => {
    if (!isCurrent()) return;
    if (!msg.pet) return;
    if (msg.userId === currentUserId) {
      petState = { ...petState, ...msg.pet };
      sendToPet('pet:state', copyPetState());
    }
    else sendToRenderer('pet:remote', msg);
  });
  activeSocket.on('ONLINE_LIST', msg => { if (isCurrent()) sendToRenderer('online:update', msg); });
  activeSocket.on('CHAT', msg => {
    if (!isCurrent()) return;
    sendToRenderer('chat:message', msg);
    sendToPet('chat:bubble', msg);
  });
  activeSocket.on('ROOM_LIST', msg => { if (isCurrent()) sendToRenderer('room:list', msg); });
  activeSocket.on('ROOM_USERS', msg => {
    if (!isCurrent()) return;
    if (msg.roomId === currentRoomId) sendToRenderer('room:users', msg);
  });
  activeSocket.on('ROOM_JOINED', msg => {
    if (!isCurrent()) return;
    currentRoomId = msg.roomId || currentRoomId;
    preferences.roomId = currentRoomId;
    persistPreferences();
    sendToRenderer('room:joined', msg);
    sendToRenderer('room:list', { rooms: msg.rooms || [] });
    sendToRenderer('room:users', { roomId: currentRoomId, users: msg.users || [] });
  });
  activeSocket.on('ERROR', msg => { if (isCurrent()) sendToRenderer('app:error', msg); });
  activeSocket.connect();
}

function createWindow() {
  const rendererPath = path.join(__dirname, 'pet.html');
  const rendererUrl = pathToFileURL(rendererPath).toString();
  win = new BrowserWindow({
    width: 380,
    height: 650,
    minWidth: 340,
    minHeight: 520,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    }
  });

  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  win.webContents.on('will-navigate', (event, url) => {
    if (url !== rendererUrl) event.preventDefault();
  });
  win.webContents.on('did-fail-load', (_event, code, description, url) => {
    writeStartupError(new Error(`Renderer load failed (${code}): ${description} at ${url}`));
  });
  win.loadFile(rendererPath).catch(writeStartupError);
  win.once('ready-to-show', () => win.show());
  win.on('closed', () => { win = null; });
  if (!socket) connectSocket();
}

function createPetWindow() {
  const rendererPath = path.join(__dirname, 'pet-window.html');
  const rendererUrl = pathToFileURL(rendererPath).toString();
  const area = screen.getPrimaryDisplay().workArea;
  const initial = preferences.petPosition
    ? clampPetPosition(petState.position.x, petState.position.y)
    : { x: area.x + area.width - PET_WINDOW_SIZE.width - 28, y: area.y + area.height - PET_WINDOW_SIZE.height - 20 };

  petWin = new BrowserWindow({
    ...PET_WINDOW_SIZE,
    x: initial.x,
    y: initial.y,
    transparent: true,
    frame: false,
    resizable: false,
    hasShadow: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    }
  });
  petWin.setAlwaysOnTop(true, 'floating');
  petWin.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  petWin.webContents.on('will-navigate', (event, url) => {
    if (url !== rendererUrl) event.preventDefault();
  });
  petWin.loadFile(rendererPath).catch(writeStartupError);
  petWin.once('ready-to-show', () => {
    petWin.showInactive();
    sendToPet('pet:state', copyPetState());
    sendToPet('movement:state', { paused: movementPaused });
    schedulePetWalk(3000);
  });
  petWin.on('closed', () => {
    stopPetAnimation();
    if (movementTimer) clearTimeout(movementTimer);
    petWin = null;
  });
}

function registerIpc() {
  ipcMain.handle('pet:getState', event => {
    requireAllowedSender(event, win, petWin);
    return copyPetState();
  });
  ipcMain.handle('room:getCurrent', event => {
    requireAllowedSender(event, win);
    return currentRoomId;
  });
  ipcMain.handle('preferences:get', event => {
    requireAllowedSender(event, win);
    return { ...preferences };
  });
  ipcMain.handle('preferences:save', (event, nextPreferences) => {
    requireAllowedSender(event, win);
    const previousUrl = preferences.serverUrl;
    preferences = savePreferences(preferencesFile, nextPreferences, {
      serverUrl: config.wsUrl, nickname: 'Guest', roomId: 'lobby',
      petPosition: preferences.petPosition, movementPaused: preferences.movementPaused
    });
    profile.name = preferences.nickname;
    currentRoomId = preferences.roomId;
    if (preferences.serverUrl !== previousUrl) {
      socket?.close();
      socket = null;
      connectSocket();
    } else {
      sendMessage('LOGIN', { username: profile.name });
      sendMessage('ROOM_JOIN', { roomId: currentRoomId });
    }
    return { ...preferences };
  });
  ipcMain.on('user:login', (event, name) => {
    if (!isAllowedSender(event, win)) return;
    profile.name = typeof name === 'string' ? name.trim().slice(0, 24) || 'Guest' : 'Guest';
    preferences.nickname = profile.name;
    persistPreferences();
    sendMessage('LOGIN', { username: profile.name });
  });
  ipcMain.handle('pet:feed', event => {
    requireAllowedSender(event, win);
    return interactWithPet('feed');
  });
  ipcMain.handle('pet:play', event => {
    requireAllowedSender(event, win);
    return interactWithPet('play');
  });
  ipcMain.handle('pet:interact', (event, kind) => {
    requireAllowedSender(event, petWin);
    return interactWithPet(typeof kind === 'string' ? kind : '');
  });
  ipcMain.handle('movement:toggle', (event, paused) => {
    requireAllowedSender(event, win, petWin);
    return setMovementPaused(Boolean(paused));
  });
  ipcMain.on('pet:dragStart', (event, point) => {
    if (!isAllowedSender(event, petWin)) return;
    if (!point || !Number.isFinite(point.x) || !Number.isFinite(point.y) || !petWin) return;
    stopPetAnimation();
    if (movementTimer) clearTimeout(movementTimer);
    const [x, y] = petWin.getPosition();
    dragOffset = { x: Math.round(point.x) - x, y: Math.round(point.y) - y };
  });
  ipcMain.on('pet:dragMove', (event, point) => {
    if (!isAllowedSender(event, petWin)) return;
    if (!dragOffset || !point || !Number.isFinite(point.x) || !Number.isFinite(point.y)) return;
    setPetWindowPosition(Math.round(point.x) - dragOffset.x, Math.round(point.y) - dragOffset.y);
  });
  ipcMain.on('pet:dragEnd', event => {
    if (!isAllowedSender(event, petWin)) return;
    if (!dragOffset) return;
    dragOffset = null;
    syncPetState();
    persistPreferences();
    if (!movementPaused) schedulePetWalk(4000);
  });
  ipcMain.on('room:create', (event, roomId) => {
    if (isAllowedSender(event, win)) sendMessage('ROOM_CREATE', { roomId });
  });
  ipcMain.on('room:join', (event, roomId) => {
    if (isAllowedSender(event, win)) sendMessage('ROOM_JOIN', { roomId });
  });
  ipcMain.on('chat:send', (event, message) => {
    if (isAllowedSender(event, win)) sendMessage('CHAT', { message });
  });
  ipcMain.on('panel:show', event => {
    if (!isAllowedSender(event, petWin)) return;
    if (!win || win.isDestroyed()) createWindow();
    else { win.show(); win.focus(); }
  });
  ipcMain.on('window:minimize', event => {
    if (isAllowedSender(event, win)) win?.minimize();
  });
  ipcMain.on('window:close', event => {
    if (isAllowedSender(event, win)) win?.hide();
  });
  ipcMain.on('app:quit', event => {
    if (isAllowedSender(event, petWin)) app.quit();
  });
}

if (!hasSingleInstanceLock) {
  app.quit();
} else {
  app.whenReady().then(() => {
    app.setAppUserModelId('io.github.fafaop.desktoppetonline');
    preferencesFile = path.join(app.getPath('userData'), 'preferences.json');
    preferences = loadPreferences(preferencesFile, {
      serverUrl: config.wsUrl, nickname: 'Guest', roomId: 'lobby', petPosition: null, movementPaused: false
    });
    profile.name = preferences.nickname;
    currentRoomId = preferences.roomId;
    if (preferences.petPosition) petState.position = { ...preferences.petPosition };
    movementPaused = preferences.movementPaused;
    session.defaultSession.setPermissionRequestHandler((_webContents, _permission, callback) => callback(false));
    session.defaultSession.setPermissionCheckHandler(() => false);
    registerIpc();
    createWindow();
    createPetWindow();
    app.on('activate', () => {
      if (!win || win.isDestroyed()) createWindow();
      else win.show();
      if (!petWin || petWin.isDestroyed()) createPetWindow();
    });
  });

  app.on('second-instance', () => {
    if (!win || win.isDestroyed()) createWindow();
    else {
      if (win.isMinimized()) win.restore();
      win.show();
      win.focus();
    }
    if (!petWin || petWin.isDestroyed()) createPetWindow();
  });

  app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
  app.on('before-quit', () => {
    stopPetAnimation();
    if (movementTimer) clearTimeout(movementTimer);
    persistPreferences();
    socket?.close();
  });
}
