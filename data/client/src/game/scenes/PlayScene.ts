import { Scene } from "phaser";
import io from "socket.io-client";
import paddle from "@/assets/game/paddle.svg";
export default class PlayScene extends Scene {
  ballPosition: any;
  ball: any;
  paddlePosition1: any;
  paddlePosition2: any;
  paddle1: any;
  paddle2: any;
  timer: any;
  timerText!: Phaser.GameObjects.Text; // Add the '!' operator to indicate that this property will be initialized later
  score: any;
  socket: any;

  constructor() {
    super({ key: "PlayScene" });
  }

  preload() {
    const socket = io("ws://localhost:3001", { transports: ["websocket"] });
    this.socket = socket;

    this.ballPosition = [300, 300];
    this.paddlePosition1 = [0, 0];
    this.paddlePosition2 = [0, 0]; // A bien remplacer plus tard
  }

  displayBall() {
    const ball = this.add.image(
      this.ballPosition.x,
      this.ballPosition.y,
      "ball"
    );
    this.ball = ball;
  }

  displayPaddle1() {
    const paddle1 = this.add.image(
      this.paddlePosition1.x,
      this.paddlePosition1.y,
      "paddle"
    );
    this.paddle1 = paddle1;
  }

  displayPaddle2() {
    const paddle2 = this.add.image(
      this.paddlePosition2.x,
      this.paddlePosition2.y,
      "paddle"
    );
    this.paddle2 = paddle2;
  }

  // displayScore() {}

  // displayTimer() {
  //   this.timerText = this.add.text(10, 50, "00:00", {
  //     font: "32px Arial",
  //     color: "#ffffff",
  //   });
  // }

  create() {
    // background
    this.add.image(400, 300, "sky");

    // timer
    this.timer = 0; // Définissez le timer à 0 par défaut
    this.timerText = this.add.text(10, 10, "Time: 0", {
      font: "16px Arial",
      color: "#ffffff",
    });

    // input
    let upKey = null;
    let downKey = null;
    if (this.input.keyboard) {
      upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
      downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    }

    upKey?.on("down", () => {
      this.socket.emit("moveUp");
    });

    downKey?.on("down", () => {
      this.socket.emit("moveDown");
    });

    // receive
    this.socket.on("ball", (ball: any) => {
      this.ballPosition = [ball.x, ball.y];
    });
    this.displayBall();

    this.socket.on("paddle1", (paddle1: any) => {
      this.paddlePosition1 = [paddle1[0], paddle1[1]];
    });
    this.displayPaddle1();

    this.socket.on("paddle2", (paddle2: any) => {
      this.paddlePosition2 = [paddle2[0], paddle2[1]];
    });
    this.displayPaddle2();

    this.socket.on("score", (score: any) => {
      this.score = score;
    });

    this.socket.on("time", (time: any) => {
      this.timer = time;
    });

    this.socket.on("alreadyConnected", () => {
      this.scene.start("ErrorScene", {
        message: "Vous êtes déjà connecté à une partie.",
      });
    });
  }

  update() {
    this.ball.x = this.ballPosition[0];
    this.ball.y = this.ballPosition[1];

    this.paddle1.x = this.paddlePosition1[0];
    this.paddle1.y = this.paddlePosition1[1];

    this.paddle2.x = this.paddlePosition2[0];
    this.paddle2.y = this.paddlePosition2[1];

    const minutes = Math.floor(this.timer / 60);
    const seconds = Math.floor(this.timer % 60);
    this.timerText.setText(
      "Time: " + minutes + ":" + (seconds < 10 ? "0" : "") + seconds
    );

    console.log("padde1", this.paddlePosition1[0]);
    // console.log("update", this.ballPosition[0]);
  }
}
