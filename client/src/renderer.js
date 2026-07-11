const api = window.desktopPet;
const byId = id => document.getElementById(id);
const remotePets = new Map();
let currentRoomId = 'lobby';
let toastTimer;
let movementPaused = false;

function setText(id, value) { byId(id).textContent = value; }
function showError(message) {
  const toast = byId('toast');
  toast.textContent = message || 'Something went wrong';
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 3500);
}

async function refreshPet() {
  const state = await api.getState();
  setText('pet-name', `${state.name} · Lv.${state.level}`);
  setText('pet-status', `Mood ${state.mood} · Hunger ${state.hunger}`);
}

function renderRooms(rooms) {
  const container = byId('rooms');
  container.replaceChildren();
  if (!rooms.length) {
    const empty = document.createElement('span'); empty.className = 'muted'; empty.textContent = 'No rooms yet'; container.append(empty); return;
  }
  for (const room of rooms) {
    const chip = document.createElement('span'); chip.className = 'chip'; chip.textContent = `${room.name} (${room.count})`; container.append(chip);
  }
}

function renderRemotePets() {
  const container = byId('remote-pets');
  container.replaceChildren();
  if (!remotePets.size) { container.textContent = 'None'; container.className = 'muted'; return; }
  container.className = 'chips';
  for (const [userId, pet] of remotePets) {
    const chip = document.createElement('span'); chip.className = 'chip'; chip.textContent = `🐾 ${userId}: mood ${pet.mood}`; container.append(chip);
  }
}

function sendChat() {
  const input = byId('message');
  const value = input.value.trim();
  if (value) api.sendChat(value);
  input.value = '';
}

async function saveSettings() {
  try {
    const saved = await api.savePreferences({
      serverUrl: byId('server-url').value.trim(),
      nickname: byId('nickname').value,
      roomId: currentRoomId
    });
    byId('server-url').value = saved.serverUrl;
    byId('nickname').value = saved.nickname === 'Guest' ? '' : saved.nickname;
  } catch {
    showError('Unable to save connection settings');
  }
}

byId('minimize').addEventListener('click', api.minimize);
byId('close').addEventListener('click', api.close);
byId('feed').addEventListener('click', async () => { await api.feed(); refreshPet(); });
byId('play').addEventListener('click', async () => { await api.play(); refreshPet(); });
byId('toggle-movement').addEventListener('click', async () => {
  movementPaused = !movementPaused;
  await api.setMovementPaused(movementPaused);
});
byId('login').addEventListener('click', () => api.login(byId('nickname').value));
byId('join-room').addEventListener('click', () => api.joinRoom(byId('room-id').value));
byId('create-room').addEventListener('click', () => api.createRoom(byId('room-id').value));
byId('send-chat').addEventListener('click', sendChat);
byId('save-settings').addEventListener('click', saveSettings);
byId('message').addEventListener('keydown', event => { if (event.key === 'Enter') sendChat(); });

api.on('connection:update', data => {
  const status = data.status || 'offline';
  const node = byId('connection');
  node.className = `connection ${status}`;
  node.textContent = status === 'reconnecting' ? 'Reconnecting…' : status[0].toUpperCase() + status.slice(1);
});
api.on('online:update', data => setText('online', `${data.users?.length || 0} online`));
api.on('room:joined', data => {
  currentRoomId = data.roomId || currentRoomId;
  remotePets.clear(); renderRemotePets();
  setText('room-current', `Room · ${currentRoomId}`);
});
api.on('room:list', data => renderRooms(data.rooms || []));
api.on('room:users', data => {
  const users = data.users || [];
  setText('room-users', users.map(user => user.name).join(', ') || 'None');
  const activeIds = new Set(users.map(user => user.id));
  for (const userId of remotePets.keys()) {
    if (!activeIds.has(userId)) remotePets.delete(userId);
  }
  renderRemotePets();
});
api.on('pet:remote', data => { remotePets.set(data.userId, data.pet); renderRemotePets(); });
api.on('pet:state', state => {
  setText('pet-name', `${state.name} · Lv.${state.level}`);
  setText('pet-status', `Mood ${state.mood} · Hunger ${state.hunger}`);
});
api.on('movement:state', data => {
  movementPaused = Boolean(data.paused);
  setText('toggle-movement', movementPaused ? 'Resume roaming' : 'Pause roaming');
});
api.on('chat:message', data => {
  if (data.roomId !== currentRoomId) return;
  const row = document.createElement('div'); row.className = 'chat-message';
  const author = document.createElement('strong'); author.textContent = `${data.username}: `;
  row.append(author, document.createTextNode(data.message));
  const log = byId('chat');
  log.append(row);
  while (log.childElementCount > 200) log.firstElementChild.remove();
  log.scrollTop = log.scrollHeight;
});
api.on('app:error', data => showError(data.message));

Promise.all([refreshPet(), api.getPreferences()])
  .then(([_state, saved]) => {
    byId('server-url').value = saved.serverUrl;
    byId('nickname').value = saved.nickname === 'Guest' ? '' : saved.nickname;
    currentRoomId = saved.roomId;
    setText('room-current', `Room · ${currentRoomId}`);
  })
  .catch(() => showError('Unable to load application settings'));
