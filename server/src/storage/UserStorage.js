const fs = require('fs');
const path = require('path');

class UserStorage {
  constructor(file = 'users.json') {
    this.file = path.join(__dirname, '../../data', file);
  }

  save(users) {
    const dir = path.dirname(this.file);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(this.file, JSON.stringify(users, null, 2));
  }

  load() {
    if (!fs.existsSync(this.file)) {
      return [];
    }

    return JSON.parse(fs.readFileSync(this.file));
  }
}

module.exports = UserStorage;
