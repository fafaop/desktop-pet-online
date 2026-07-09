const users = new Map();

export function addUser(id, socket) {
  users.set(id, socket);
}

export function removeUser(id) {
  users.delete(id);
}

export function getOnlineUsers() {
  return [...users.keys()];
}

export function broadcast(data) {
  for (const socket of users.values()) {
    if (socket.readyState === 1) {
      socket.send(JSON.stringify(data));
    }
  }
}
