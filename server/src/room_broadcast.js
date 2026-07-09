import { getRoomUsers } from './room_manager.js';

export function createRoomMessage(roomId, payload) {
  return {
    type: 'ROOM_MESSAGE',
    roomId,
    payload
  };
}

export function roomContainsUser(roomId, userId) {
  return getRoomUsers(roomId).includes(userId);
}
