const rooms = new Map();

export function joinRoom(roomId, userId) {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Set());
  }
  rooms.get(roomId).add(userId);
}

export function leaveRoom(roomId, userId) {
  const room = rooms.get(roomId);
  if (!room) return;
  room.delete(userId);
  if (room.size === 0) {
    rooms.delete(roomId);
  }
}

export function getRoomUsers(roomId) {
  return rooms.has(roomId) ? [...rooms.get(roomId)] : [];
}

export function getRooms() {
  return [...rooms.keys()];
}
