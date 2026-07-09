export class Pet {
  constructor(id) {
    this.id = id;
    this.action = 'idle';
    this.position = {x:0,y:0};
  }

  walk(x, y) {
    this.action = 'walk';
    this.position = {x, y};
  }

  happy() {
    this.action = 'happy';
  }

  idle() {
    this.action = 'idle';
  }

  state() {
    return {
      type:'PET_STATE',
      petId:this.id,
      action:this.action,
      position:this.position
    };
  }
}
