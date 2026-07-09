/**
 * Desktop Pet Online common message protocol
 * Client <-> Server message definitions
 */

module.exports = {
  LOGIN: 'LOGIN',
  WELCOME: 'WELCOME',
  USER_UPDATE: 'USER_UPDATE',

  ROOM_JOIN: 'ROOM_JOIN',
  ROOM_JOINED: 'ROOM_JOINED',
  ROOM_LEAVE: 'ROOM_LEAVE',

  CHAT: 'CHAT',

  PET_UPDATE: 'PET_UPDATE',
  PET_SYNC: 'PET_SYNC',

  HEARTBEAT: 'HEARTBEAT',
  HEARTBEAT_ACK: 'HEARTBEAT_ACK',

  ERROR: 'ERROR'
};
