class PetView {
  constructor(element) {
    this.element = element;
    this.pet = null;
  }

  bind(model) {
    this.pet = model;
    this.render();
  }

  render() {
    if (!this.element || !this.pet) {
      return;
    }

    this.element.innerText = `Pet: ${this.pet.state}`;
    this.element.style.transform =
      `translate(${this.pet.position.x}px, ${this.pet.position.y}px)`;
  }

  refresh() {
    this.render();
  }
}

module.exports = PetView;
