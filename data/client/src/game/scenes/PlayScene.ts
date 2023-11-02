import { Scene } from "phaser";
import io from "socket.io-client";
export default class PlayScene extends Scene {
  ballPosition: any;
  ball: any;
  socket: any;

  constructor() {
    super({ key: "PlayScene" });
  }

  // init(data: any) {
  //   this.ballPosition = data.ballPosition;
  // }

  preload() {
    const socket = io("ws://localhost:3001", { transports: ["websocket"] });
    this.socket = socket;
    this.ballPosition = [300, 300];
  }

  create() {
    this.add.image(400, 300, "sky");
    const x = this.ballPosition[0];
    const y = this.ballPosition[1];
    const ball = this.add.image(x, y, "ball");
    console.log("data=", this.ballPosition[0]);

    this.ball = ball;

    this.socket.on("ball", (ball: any) => {
      const array = new Float32Array(ball);
      console.log("Ball received from server:", array[0], array[1]);
      this.ballPosition = [array[0], array[1]];
    });
  }

  update() {
    this.ball.x = this.ballPosition[0]; // Accédez au tableau de position
    this.ball.y = this.ballPosition[1];
    console.log("update", this.ballPosition[0]);
  }
}
