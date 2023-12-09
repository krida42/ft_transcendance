import { Scene } from "phaser";
import sky from "@/assets/game/sky.png";
import ball from "@/assets/game/ball.png";
import thudMp3 from "@/assets/game/thud.mp3";
import thudOgg from "@/assets/game/thud.ogg";
import paddle from "@/assets/game/paddle.svg";
import io from "socket.io-client";
import { Socket } from "socket.io-client";
export default class BootScene extends Scene {
  private socket!: Socket;
  constructor() {
    super({ key: "BootScene" });
  }

  preload() {
    this.load.image("sky", sky);
    this.load.image("ball", ball);
    this.load.audio("thud", [thudMp3, thudOgg]);
    this.load.svg("paddle", paddle, { width: 100, height: 100 });
  }

  create() {
    this.scene.start("PlayScene");
  }
}
