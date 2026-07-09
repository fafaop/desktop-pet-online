class ChatPanel {
  constructor(element) {
    this.element = element;
    this.messages = [];
  }

  addMessage(message) {
    this.messages.push(message);
    this.render();
  }

  render() {
    if (!this.element) {
      return;
    }

    this.element.innerHTML = this.messages
      .map(item => `<div>${item}</div>`)
      .join('');
  }
}

module.exports = ChatPanel;
