export default class ErrorScene extends Phaser.Scene {
  message = "";

  constructor() {
    super("ErrorScene");
  }

  init(data: { message: string }) {
    this.message = data.message;
  }

  create() {
    this.add.text(260, 300, this.message, { color: "#f00", fontSize: "32px" });
  }
}
