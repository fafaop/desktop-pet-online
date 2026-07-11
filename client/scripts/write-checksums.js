const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const dist = path.join(__dirname, '..', 'dist');
const artifacts = fs.readdirSync(dist)
  .filter(name => name.endsWith('.exe') || name.endsWith('.blockmap'))
  .sort();

if (artifacts.length === 0) {
  throw new Error('No Windows release artifacts found in client/dist');
}

const lines = artifacts.map(name => {
  const data = fs.readFileSync(path.join(dist, name));
  return `${crypto.createHash('sha256').update(data).digest('hex')}  ${name}`;
});

fs.writeFileSync(path.join(dist, 'SHA256SUMS.txt'), `${lines.join('\n')}\n`);
console.log(lines.join('\n'));
