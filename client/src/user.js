export class User {
  constructor(id, nickname) {
    this.id = id;
    this.nickname = nickname;
  }

  loginMessage() {
    return {
      type:'LOGIN',
      userId:this.id,
      nickname:this.nickname
    };
  }
}
