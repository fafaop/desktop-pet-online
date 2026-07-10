const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const PetSocket = require('./network/websocket');
const PetEngine = require('./pet/PetEngine');
const PetStorage = require('./storage/PetStorage');
const config = require('./config');

const storage = new PetStorage(path.join(app.getPath('userData'), 'pet-data.json'));
const petEngine = new PetEngine(storage.load() || {});

let socket;
let win;
let currentRoomId = 'lobby';

function createWindow() {
  win = new BrowserWindow({
    width: 360,
    height: 520,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile(path.join(__dirname, 'pet.html'));

  socket = new PetSocket(config.wsUrl);

  socket.on('WELCOME', msg => {
    if (msg.pet) Object.assign(petEngine.state, msg.pet);
    currentRoomId = msg.roomId || currentRoomId;
  });

  socket.connect();

  petEngine.onChange(state => {
    storage.save(state);
    if (win) win.webContents.send('pet:update', state);
  });

  setInterval(() => petEngine.tick(), 30000);

  ipcMain.handle('pet:getState', () => petEngine.getState());
  ipcMain.handle('pet:feed', () => {
    petEngine.feed();
    return petEngine.getState();
  });

  ipcMain.handle('pet:play', () => {
    petEngine.play();
    return petEngine.getState();
  });

  ipcMain.handle('room:getCurrent', () => currentRoomId);
}

app.whenReady().then(createWindow);
