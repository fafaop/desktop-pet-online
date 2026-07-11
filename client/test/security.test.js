const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('renderer uses isolated preload and contains no dynamic HTML sinks', () => {
  const main = fs.readFileSync(path.join(__dirname, '../src/main.js'), 'utf8');
  const bootstrap = fs.readFileSync(path.join(__dirname, '../src/bootstrap.js'), 'utf8');
  const renderer = fs.readFileSync(path.join(__dirname, '../src/renderer.js'), 'utf8');
  const petRenderer = fs.readFileSync(path.join(__dirname, '../src/pet-window.js'), 'utf8');
  const html = fs.readFileSync(path.join(__dirname, '../src/pet.html'), 'utf8');
  const petHtml = fs.readFileSync(path.join(__dirname, '../src/pet-window.html'), 'utf8');

  assert.match(main, /nodeIntegration:\s*false/);
  assert.match(bootstrap, /require\('\.\/main'\)/);
  assert.match(main, /require\('\.\/Network\/websocket'\)/);
  assert.match(main, /contextIsolation:\s*true/);
  assert.match(main, /sandbox:\s*true/);
  assert.match(main, /setWindowOpenHandler/);
  assert.match(main, /will-navigate/);
  assert.match(main, /url !== rendererUrl/);
  assert.match(main, /setPermissionRequestHandler/);
  assert.match(main, /if \(!hasSingleInstanceLock\)[\s\S]*app\.quit\(\)[\s\S]*else/);
  assert.doesNotMatch(renderer, /innerHTML|outerHTML|insertAdjacentHTML/);
  assert.doesNotMatch(petRenderer, /innerHTML|outerHTML|insertAdjacentHTML|eval\s*\(/);
  assert.match(html, /Content-Security-Policy/);
  assert.match(petHtml, /Content-Security-Policy/);
  assert.doesNotMatch(html, /onclick=/);
  assert.doesNotMatch(petHtml, /onclick=/);
  assert.match(main, /Number\.isFinite\(point\.x\)/);
  assert.match(main, /INTERACTIONS\[kind\]/);
  assert.match(main, /event\.sender === window\.webContents/);
  assert.match(main, /requireAllowedSender\(event, petWin\)/);
  assert.match(main, /ipcMain\.on\('app:quit'[\s\S]*isAllowedSender\(event, petWin\)/);
  assert.match(main, /ipcMain\.on\('window:close'[\s\S]*win\?\.hide\(\)/);
});

test('pet window stays isolated and desktop movement uses work areas', () => {
  const main = fs.readFileSync(path.join(__dirname, '../src/main.js'), 'utf8');
  const preload = fs.readFileSync(path.join(__dirname, '../src/preload.js'), 'utf8');
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));

  assert.match(main, /transparent:\s*true/);
  assert.match(main, /frame:\s*false/);
  assert.match(main, /alwaysOnTop:\s*true/);
  assert.match(main, /skipTaskbar:\s*true/);
  assert.match(main, /screen\.getAllDisplays\(\)/);
  assert.match(main, /targetDisplay\.workArea/);
  assert.match(preload, /allowedEvents\.has\(event\)/);
  assert.match(preload, /ipcRenderer\.invoke\('pet:interact', kind\)/);
  assert.match(main, /event\.sender === window\.webContents/);
  assert.match(main, /requireAllowedSender\(event, petWin\)/);
  assert.ok(fs.existsSync(path.join(__dirname, '../src/pet-window.html')));
  assert.ok(fs.existsSync(path.join(__dirname, '../src/pet-window.css')));
  assert.ok(fs.existsSync(path.join(__dirname, '../src/pet-window.js')));
  for (const resource of ['src/pet-window.html', 'src/pet-window.css', 'src/pet-window.js']) {
    assert.ok(packageJson.build.files.includes(resource), `${resource} must be packaged`);
  }
});
