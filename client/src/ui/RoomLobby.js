class RoomLobby {
  constructor(roomModel, network) {
    this.room = roomModel;
    this.network = network;
  }

  join(roomId) {
    this.room.join(roomId);

    this.network.send('ROOM_JOIN', {
      roomId
    });
  }
}

module.exports = RoomLobby;
