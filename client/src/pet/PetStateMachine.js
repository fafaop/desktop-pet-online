class PetStateMachine {
  constructor() {
    this.state = 'idle';

    this.states = [
      'idle',
      'walk',
      'sleep',
      'happy'
    ];
  }

  transition(nextState) {
    if (this.states.includes(nextState)) {
      this.state = nextState;
    }
  }

  current() {
    return this.state;
  }
}

module.exports = PetStateMachine;
