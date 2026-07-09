import { joinRoom, leaveRoom, getRoomUsers } from './room_manager.js';

export function handleRoomMessage(msg) {
  switch(msg.type) {
    case 'JOIN_ROOM':
      joinRoom(msg.roomId, msg.userId);
      return {
        type:'ROOM_USERS',
        roomId:msg.roomId,
        users:getRoomUsers(msg.roomId)
      };

    case 'LEAVE_ROOM':
      leaveRoom(msg.roomId, msg.userId);
      return {
        type:'ROOM_USERS',
        roomId:msg.roomId,
        users:getRoomUsers(msg.roomId)
      };

    default:
      return null;
  }
}
