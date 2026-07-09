class RoomLobby {
  constructor(roomModel, network) {
    this.room = roomModel;
    this.network = network;
  }

  join(roomId) {
    this.room.join(roomId);

    this.network.send('room_join', {
      roomId
    });
  }
}

module.exports = RoomLobby;
