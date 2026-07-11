const fs = require('fs');
const os = require('os');
const path = require('path');

try {
  require('./main');
} catch (error) {
  try {
    fs.appendFileSync(
      path.join(os.tmpdir(), 'desktop-pet-online-startup.log'),
      `[${new Date().toISOString()}] ${error?.stack || error}\n`
    );
  } finally {
    process.exitCode = 1;
  }
}
