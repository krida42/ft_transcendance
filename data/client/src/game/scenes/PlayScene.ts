import { Scene } from "phaser";
import io from "socket.io-client";
import { Client } from "colyseus.js";
export default class PlayScene extends Scene {
  ballPosition: any;
  ball: any;
  socket: any;
  // flame: any;
  room: any;

  constructor() {
    super({ key: "PlayScene" });
  }

  async preload() {
    try {
      const client = new Client("ws://localhost:2567");
      this.room = await client.joinOrCreate("pong");
      this.ballPosition = [300, 300];

      this.room.onStateChange((state: any) => {
        console.log("New room state:", state);
        this.ballPosition = state.ball;
      });

      this.room.onJoin((message: any) => {
        console.log("OnJoin message received", message);
      });

      this.room.onMessage("ball", (message: any) => {
        console.log("ball message received", message);
        this.ballPosition = message.position;
      });
    } catch (e) {
      console.error(e);
    }
  }

  create() {
    // this.flame = this.add.particles(150, 550, "flame", {
    //   frame: "white",
    //   color: [0xfacc22, 0xf89800, 0xf83600, 0x9f0404],
    //   colorEase: "quad.out",
    //   lifespan: 2400,
    //   angle: { min: -100, max: -80 },
    //   scale: { start: 0.7, end: 0, ease: "sine.out" },
    //   speed: 100,
    //   advance: 2000,
    //   blendMode: "ADD",
    // }); ne marche pas

    // this.add.image(400, 300, "sky");
    if (!this.ballPosition || !this.room) {
      console.error("Ball position or room is not defined yet");
      return;
    }
    if (this.ballPosition) {
      const x = this.ballPosition[0];
      const y = this.ballPosition[1];
      const ball = this.add.image(x, y, "ball");
      this.ball = ball;
    } else {
      console.error("Ball position is not defined yet");
    }
    console.log("data=", this.ballPosition[0]);
  }

  update() {
    // Mettez à jour la position de la balle en fonction des messages du serveur
    if (!this.ballPosition) {
      return;
    }
    this.ball.x = this.ballPosition[0];
    this.ball.y = this.ballPosition[1];

    // Envoyez un message au serveur chaque fois que le joueur déplace sa raquette
    // if (this.input.activePointer.isDown) {
    //   this.room.send("movePaddle", {
    //     position: this.input.activePointer.position,
    //   });
    // }
  }
}
