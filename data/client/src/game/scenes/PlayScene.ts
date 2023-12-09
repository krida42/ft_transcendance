import { Scene } from "phaser";
import io from "socket.io-client";
export default class PlayScene extends Scene {
  // socket = "player"
  socket: any;

  // gameObjects
  ballPosition: any;
  ball: any;
  paddlePosition1: any;
  paddlePosition2: any;
  paddle1: any;
  paddle2: any;

  timer: any;
  timerText!: Phaser.GameObjects.Text; // Add the '!' operator to indicate that this property will be initialized later

  score: any;
  scoreText!: Phaser.GameObjects.Text;

  pause: any;
  pauseText!: Phaser.GameObjects.Text;

  //input
  upKey: any;
  downKey: any;
  leftKey: any;
  rightKey: any;

  constructor() {
    super({ key: "PlayScene" });
  }

  preload() {
    const socket = io("http://localhost:3001/game", {
      withCredentials: true,
    });
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

  create() {
    // background
    this.add.image(400, 300, "sky");

    // timer
    this.timer = 0; // Définissez le timer à 0 par défaut
    this.timerText = this.add.text(400, 10, "Time: 0", {
      font: "16px Arial",
      color: "#ffffff",
    });

    //score
    this.score = [0, 0];
    this.scoreText = this.add.text(400, 30, "", {
      font: "16px Arial",
      color: "#ffffff",
    });

    // pause
    this.pause = false;
    this.pauseText = this.add.text(400, 300, "", {
      font: "16px Arial",
      color: "#ffffff",
    });

    // screen-split
    const graphics = this.add.graphics({ lineStyle: { color: 0xffffff } }); // Remplacez 0xffffff par la couleur que vous voulez
    const screenHeight = this.cameras.main.height;
    const screenWidth = this.cameras.main.width;
    const dashSize = 10;
    const gapSize = 5;

    for (let y = 0; y < screenHeight; y += dashSize + gapSize) {
      graphics.lineBetween(screenWidth / 2, y, screenWidth / 2, y + dashSize);
    }

    // input
    if (!this.input.keyboard) {
      return;
    }
    this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.downKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.DOWN
    );
    this.leftKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.LEFT
    );
    this.rightKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.RIGHT
    );

    // emit
    this.upKey.on("down", () => {
      this.socket.emit("moveUp");
    });
    this.upKey.on("up", () => {
      this.socket.emit("stopMoving");
    });

    this.downKey.on("down", () => {
      this.socket.emit("moveDown");
    });
    this.downKey.on("up", () => {
      this.socket.emit("stopMoving");
    });

    this.leftKey.on("down", () => {
      this.socket.emit("moveLeft");
    });
    this.leftKey.on("up", () => {
      this.socket.emit("stopMoving");
    });

    this.rightKey.on("down", () => {
      this.socket.emit("moveRight");
    });
    this.rightKey.on("up", () => {
      this.socket.emit("stopMoving");
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

    this.socket.on("gameState", (gameState: any) => {
      this.timer = gameState.time;
      this.score = gameState.score;
    });

    this.socket.on("pause", () => {
      this.pause = true;
    });

    this.socket.on("resume", () => {
      this.pause = false;
    });

    this.socket.on("winner", () => {
      this.scene.start("ErrorScene", {
        message: "Vous avez gagné !",
      });
    });

    this.socket.on("loser", () => {
      this.scene.start("ErrorScene", {
        message: "Vous avez perdu !",
      });
    });

    this.socket.on("draw", () => {
      this.scene.start("ErrorScene", {
        message: "Match nul !",
      });
    });

    this.socket.on("alreadyConnected", () => {
      this.scene.start("ErrorScene", {
        message: "Vous êtes déjà connecté à une partie.",
      });
    });
  }

  update() {
    // display objects
    this.ball.x = this.ballPosition[0];
    this.ball.y = this.ballPosition[1];

    this.paddle1.x = this.paddlePosition1[0];
    this.paddle1.y = this.paddlePosition1[1];

    this.paddle2.x = this.paddlePosition2[0];
    this.paddle2.y = this.paddlePosition2[1];

    // move paddle
    if (this.upKey.isDown) {
      this.socket.emit("moveUp");
    }
    if (this.downKey.isDown) {
      this.socket.emit("moveDown");
    }
    if (this.leftKey.isDown) {
      this.socket.emit("moveLeft");
    }
    if (this.rightKey.isDown) {
      this.socket.emit("moveRight");
    }

    // display timer
    const minutes = Math.floor(this.timer / 60);
    const seconds = Math.floor(this.timer % 60);
    this.timerText.setText(
      minutes + " : " + (seconds < 10 ? "0" : "") + seconds
    );

    // display score
    this.scoreText.setText(this.score[0] + " - " + this.score[1]);

    // display pause
    if (this.pauseText) {
      this.pauseText.setText(this.pause ? "Pause" : "");
    }
  }
}
