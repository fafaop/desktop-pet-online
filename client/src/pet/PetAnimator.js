class PetAnimator {
  constructor(view) {
    this.view = view;
    this.timer = null;
  }

  start() {
    this.stop();

    this.timer = setInterval(() => {
      if (this.view) {
        this.view.refresh();
      }
    }, 1000);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

module.exports = PetAnimator;
