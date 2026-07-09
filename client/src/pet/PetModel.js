class PetModel {
  constructor() {
    this.state = 'idle';
    this.emotion = 'normal';
    this.position = {
      x: 0,
      y: 0
    };
  }

  update(data) {
    if (data.state) {
      this.state = data.state;
    }

    if (data.emotion) {
      this.emotion = data.emotion;
    }

    if (data.position) {
      this.position = data.position;
    }
  }

  toJSON() {
    return {
      state: this.state,
      emotion: this.emotion,
      position: this.position
    };
  }
}

module.exports = PetModel;
