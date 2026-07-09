class MessageHandler {
  constructor(roomManager) {
    this.roomManager = roomManager;
  }

  handle(user, message) {
    if (!message || !message.type) {
      return;
    }

    switch (message.type) {
      case 'chat':
        this.roomManager.broadcast(message.roomId, {
          type: 'chat',
          userId: user.id,
          data: message.data,
          timestamp: Date.now()
        });
        break;

      case 'pet_update':
        this.roomManager.broadcast(message.roomId, {
          type: 'pet_update',
          userId: user.id,
          data: message.data,
          timestamp: Date.now()
        });
        break;
    }
  }
}

module.exports = MessageHandler;
