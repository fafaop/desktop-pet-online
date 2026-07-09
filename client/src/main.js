const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let petState = {
  name: 'Mimi',
  level: 1,
  mood: 80,
  hunger: 20,
  online: false
};

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

  ipcMain.handle('pet:getState', () => petState);

  ipcMain.handle('pet:feed', () => {
    petState.hunger = Math.max(0, petState.hunger - 20);
    petState.mood = Math.min(100, petState.mood + 10);
    return petState;
  });

  ipcMain.handle('pet:play', () => {
    petState.mood = Math.min(100, petState.mood + 15);
    petState.hunger = Math.min(100, petState.hunger + 5);
    return petState;
  });
}

app.whenReady().then(createWindow);