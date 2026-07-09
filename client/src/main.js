const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const PetSocket = require('./network/websocket');

let petState = {
  name: 'Mimi',
  level: 1,
  mood: 80,
  hunger: 20,
  online: false
};

let socket;

function createWindow() {
  const win = new BrowserWindow({
    width: 360,
    height: 420,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile(path.join(__dirname, 'pet.html'));

  socket = new PetSocket('ws://localhost:8080');
  socket.on('WELCOME', msg => {
    petState.online = true;
    if (msg.pet) petState = { ...petState, ...msg.pet };
  });
  socket.on('PET_UPDATE', msg => {
    if (msg.pet) petState = { ...petState, ...msg.pet };
  });
  socket.connect();

  ipcMain.handle('pet:getState', () => petState);

  ipcMain.handle('pet:feed', () => {
    petState.hunger = Math.max(0, petState.hunger - 20);
    petState.mood = Math.min(100, petState.mood + 10);
    socket.send('PET_UPDATE', { state: petState });
    return petState;
  });

  ipcMain.handle('pet:play', () => {
    petState.mood = Math.min(100, petState.mood + 15);
    petState.hunger = Math.min(100, petState.hunger + 5);
    socket.send('PET_UPDATE', { state: petState });
    return petState;
  });
}

app.whenReady().then(createWindow);
