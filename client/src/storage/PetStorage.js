const fs = require('fs');
const path = require('path');

class PetStorage {
  constructor(file) {
    this.file = file || path.join(__dirname, 'pet-data.json');
  }

  load() {
    try {
      return JSON.parse(fs.readFileSync(this.file, 'utf8'));
    } catch (e) {
      return null;
    }
  }

  save(state) {
    fs.writeFileSync(this.file, JSON.stringify(state, null, 2));
  }
}

module.exports = PetStorage;
