const { contextBridge, ipcRenderer } = require('electron');

const allowedEvents = new Set([
  'connection:update', 'online:update', 'chat:message', 'room:list',
  'room:users', 'room:joined', 'pet:remote', 'pet:state', 'pet:feedback',
  'chat:bubble', 'movement:state', 'app:error', 'login:ok'
]);

contextBridge.exposeInMainWorld('desktopPet', Object.freeze({
  getState: () => ipcRenderer.invoke('pet:getState'),
  getCurrentRoom: () => ipcRenderer.invoke('room:getCurrent'),
  getPreferences: () => ipcRenderer.invoke('preferences:get'),
  savePreferences: preferences => ipcRenderer.invoke('preferences:save', preferences),
  feed: () => ipcRenderer.invoke('pet:feed'),
  play: () => ipcRenderer.invoke('pet:play'),
  interact: kind => ipcRenderer.invoke('pet:interact', kind),
  setMovementPaused: paused => ipcRenderer.invoke('movement:toggle', Boolean(paused)),
  beginPetDrag: point => ipcRenderer.send('pet:dragStart', point),
  movePetDrag: point => ipcRenderer.send('pet:dragMove', point),
  endPetDrag: () => ipcRenderer.send('pet:dragEnd'),
  showPanel: () => ipcRenderer.send('panel:show'),
  quit: () => ipcRenderer.send('app:quit'),
  login: name => ipcRenderer.send('user:login', name),
  createRoom: roomId => ipcRenderer.send('room:create', roomId),
  joinRoom: roomId => ipcRenderer.send('room:join', roomId),
  sendChat: message => ipcRenderer.send('chat:send', message),
  minimize: () => ipcRenderer.send('window:minimize'),
  close: () => ipcRenderer.send('window:close'),
  on(event, callback) {
    if (!allowedEvents.has(event) || typeof callback !== 'function') return () => {};
    const listener = (_event, data) => callback(data);
    ipcRenderer.on(event, listener);
    return () => ipcRenderer.removeListener(event, listener);
  }
}));
