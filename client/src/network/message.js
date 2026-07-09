const MessageType = {
  LOGIN: 'LOGIN',
  CHAT: 'CHAT',
  ROOM_JOIN: 'ROOM_JOIN',
  PET_UPDATE: 'PET_UPDATE',
  HEARTBEAT: 'HEARTBEAT'
};

function createMessage(type, data = {}) {
  return {
    type,
    ...data
  };
}

module.exports = {
  MessageType,
  createMessage
};
