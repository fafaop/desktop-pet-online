class PetManager {
  constructor() {
    this.pets = new Map();
  }

  create(userId) {
    const pet = {
      id: 'pet-' + userId,
      owner: userId,
      level: 1,
      mood: 80,
      hunger: 20
    };

    this.pets.set(userId, pet);
    return pet;
  }

  update(userId, state) {
    const pet = this.pets.get(userId);
    if (!pet) return null;

    Object.assign(pet, state);
    return pet;
  }

  get(userId) {
    return this.pets.get(userId);
  }
}

module.exports = PetManager;
