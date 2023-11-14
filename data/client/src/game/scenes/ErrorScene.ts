export default class ErrorScene extends Phaser.Scene {
  message = "";

  constructor() {
    super("ErrorScene");
  }

  init(data: { message: string }) {
    this.message = data.message;
  }

  create() {
    this.add.text(10, 10, this.message, { color: "#f00" });
  }
}
