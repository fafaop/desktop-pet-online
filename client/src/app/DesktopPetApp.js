const WebSocketClient = require('../network/WebSocketClient');
const LoginWindow = require('../ui/LoginWindow');
const RoomLobby = require('../ui/RoomLobby');
const RoomModel = require('../room/RoomModel');
const PetModel = require('../pet/PetModel');

class DesktopPetApp {
  constructor() {
    this.network = new WebSocketClient('ws://localhost:8080');
    this.room = new RoomModel();
    this.pet = new PetModel();
    this.login = new LoginWindow(this.network);
    this.lobby = new RoomLobby(this.room, this.network);
  }

  start() {
    this.network.connect();

    this.network.on('WELCOME', message => {
      this.login.onWelcome(message);
    });

    this.network.on('pet_update', message => {
      this.pet.update(message.data);
    });
  }
}

module.exports = DesktopPetApp;
