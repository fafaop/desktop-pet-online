class Protocol {
  static create(type, data = {}) {
    return JSON.stringify({
      type,
      timestamp: Date.now(),
      data
    });
  }

  static parse(message) {
    try {
      return JSON.parse(message);
    } catch (e) {
      return null;
    }
  }
}

module.exports = Protocol;
