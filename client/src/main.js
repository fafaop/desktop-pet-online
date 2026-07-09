const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 320,
    height: 320,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    webPreferences: { nodeIntegration: true }
  });
  win.loadFile(path.join(__dirname, 'pet.html'));
}

app.whenReady().then(createWindow);
