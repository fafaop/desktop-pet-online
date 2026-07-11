const api = window.desktopPet;
const pet = document.getElementById('pet');
const menu = document.getElementById('interaction-menu');
const speech = document.getElementById('speech');
const caption = document.getElementById('pet-caption');
const movementButton = document.getElementById('toggle-movement');
const heart = document.getElementById('heart');
let bubbleTimer;
let menuTimer;
let dragging = false;
let dragged = false;
let paused = false;

function safePoint(event) {
  return { x: Math.round(event.screenX), y: Math.round(event.screenY) };
}

function showBubble(message, author = '') {
  speech.replaceChildren();
  if (author) {
    const strong = document.createElement('strong');
    strong.textContent = `${author}: `;
    speech.append(strong);
  }
  speech.append(document.createTextNode(String(message || '').slice(0, 500)));
  speech.classList.add('visible');
  clearTimeout(bubbleTimer);
  bubbleTimer = setTimeout(() => speech.classList.remove('visible'), 5200);
}

function showMenu() {
  menu.classList.toggle('visible');
  clearTimeout(menuTimer);
  if (menu.classList.contains('visible')) menuTimer = setTimeout(() => menu.classList.remove('visible'), 8500);
}

function renderState(state) {
  const action = ['idle', 'walk', 'sleep', 'happy'].includes(state?.action) ? state.action : 'idle';
  pet.dataset.action = action;
  const mood = Number.isFinite(state?.mood) ? state.mood : 80;
  const hunger = Number.isFinite(state?.hunger) ? state.hunger : 20;
  const feeling = action === 'sleep' ? 'sleeping' : mood > 75 ? 'feeling cozy' : mood > 45 ? 'doing okay' : 'needs a cuddle';
  caption.textContent = `${state?.name || 'Mimi'} · ${feeling} · 🍪 ${hunger}`;
}

function popHeart() {
  heart.classList.remove('pop');
  void heart.offsetWidth;
  heart.classList.add('pop');
}

pet.addEventListener('pointerdown', event => {
  if (event.button !== 0) return;
  dragging = true;
  dragged = false;
  pet.setPointerCapture(event.pointerId);
  api.beginPetDrag(safePoint(event));
});
pet.addEventListener('pointermove', event => {
  if (!dragging) return;
  dragged = true;
  api.movePetDrag(safePoint(event));
});
pet.addEventListener('pointerup', event => {
  if (!dragging) return;
  dragging = false;
  api.endPetDrag();
  if (!dragged) showMenu();
});
pet.addEventListener('keydown', event => {
  if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); showMenu(); }
});

for (const button of menu.querySelectorAll('[data-action]')) {
  button.addEventListener('click', async event => {
    event.stopPropagation();
    menu.classList.remove('visible');
    const state = await api.interact(button.dataset.action);
    renderState(state);
    popHeart();
  });
}
movementButton.addEventListener('click', async () => {
  paused = !paused;
  await api.setMovementPaused(paused);
});
document.getElementById('open-panel').addEventListener('click', api.showPanel);
document.getElementById('quit-app').addEventListener('click', api.quit);

api.on('pet:state', renderState);
api.on('pet:feedback', data => { showBubble(data.message); popHeart(); });
api.on('chat:bubble', data => showBubble(data.message, data.username));
api.on('movement:state', data => {
  paused = Boolean(data.paused);
  movementButton.firstChild.textContent = paused ? '▶' : '⏸';
  movementButton.querySelector('span').textContent = paused ? 'Move' : 'Pause';
  movementButton.title = paused ? 'Resume movement' : 'Pause movement';
});

api.getState().then(renderState).catch(() => showBubble('I am waking up...'));
