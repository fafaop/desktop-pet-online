class Pet {
  constructor(data = {}) {
    this.id = data.id || '';
    this.level = data.level || 1;
    this.mood = data.mood || 80;
    this.hunger = data.hunger || 20;
  }

  update(state) {
    Object.assign(this, state);
  }
}

module.exports = Pet;
