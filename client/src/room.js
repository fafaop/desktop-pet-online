export class Room {
  constructor(id) {
    this.id = id;
    this.users = [];
  }

  updateUsers(users) {
    this.users = users;
  }

  joinMessage(userId) {
    return {
      type:'JOIN_ROOM',
      roomId:this.id,
      userId
    };
  }

  leaveMessage(userId) {
    return {
      type:'LEAVE_ROOM',
      roomId:this.id,
      userId
    };
  }
}
