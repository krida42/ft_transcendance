import { Scene } from "phaser";
import sky from "@/assets/game/sky.png";
import ball from "@/assets/game/ball.png";
import pokeball from "@/assets/game/pokeball.svg";
import thudMp3 from "@/assets/game/thud.mp3";
import thudOgg from "@/assets/game/thud.ogg";
import paddle from "@/assets/game/paddle.svg";
import io from "socket.io-client";
import { Socket } from "socket.io-client";
import { getOptions, Options } from "../game";
import { GameWaitingEvent } from "@/types";
import { socket as socketSocial } from "@/socket/index";
export default class BootScene extends Scene {
  static socket: Socket;
  options: Options;

  constructor() {
    super({ key: "BootScene" });
  }

  preload() {
    const socket = io(`${process.env.VUE_APP_CUICUI}:3001/game`, {
      withCredentials: true,
    });

    this.options = getOptions();

    socket.on("connect", () => {
      socket.emit("options", this.options);
    });

    socket.on("waiting-friend", (data: GameWaitingEvent) => {
      console.log("waiting-friend", data);
      socketSocial.emit("invite-to-play", data);
    });

    BootScene.socket = socket;

    this.load.image("sky", sky);
    // this.load.image("ball", ball);
    // this.load.svg("ball", volleyball, { width: 100, height: 100 });

    // grosse balle
    this.load.svg("largeBall", pokeball, { width: 100, height: 100 });
    this.load.svg("smallBall", pokeball, { width: 18, height: 18 });
    // petite balle

    this.load.audio("thud", [thudMp3, thudOgg]);
    this.load.svg("paddle", paddle, { width: 100, height: 100 });
  }

  create() {
    this.scene.start("PlayScene");
  }
}
