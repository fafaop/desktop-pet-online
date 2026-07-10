class PetEngine {
  constructor(initial = {}) {
    this.state = {
      name: 'Mimi',
      level: 1,
      exp: 0,
      mood: 80,
      hunger: 20,
      energy: 100,
      status: 'idle',
      ...initial
    };
    this.listeners = [];
  }

  getState() {
    return { ...this.state };
  }

  onChange(callback) {
    this.listeners.push(callback);
  }

  emit() {
    this.listeners.forEach(cb => cb(this.getState()));
  }

  feed() {
    this.state.hunger = Math.max(0, this.state.hunger - 20);
    this.state.mood = Math.min(100, this.state.mood + 10);
    this.gainExp(5);
    this.setStatus('happy');
  }

  play() {
    this.state.mood = Math.min(100, this.state.mood + 15);
    this.state.energy = Math.max(0, this.state.energy - 10);
    this.state.hunger = Math.min(100, this.state.hunger + 5);
    this.gainExp(10);
    this.setStatus('play');
  }

  tick() {
    this.state.hunger = Math.min(100, this.state.hunger + 1);
    this.state.energy = Math.max(0, this.state.energy - 1);
    if (this.state.hunger > 70) this.setStatus('hungry');
    else if (this.state.energy < 20) this.setStatus('sleep');
    else this.setStatus('idle');
  }

  gainExp(value) {
    this.state.exp += value;
    if (this.state.exp >= 100) {
      this.state.level++;
      this.state.exp = 0;
    }
  }

  setStatus(status) {
    this.state.status = status;
    this.emit();
  }
}

module.exports = PetEngine;
