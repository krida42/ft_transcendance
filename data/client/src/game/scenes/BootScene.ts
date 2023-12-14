import { Scene } from "phaser";
import sky from "@/assets/game/sky.png";
import ball from "@/assets/game/ball.png";
import cercle from "@/assets/game/cercle.svg";
import pokeball from "@/assets/game/pokeball.svg";
import volleyball from "@/assets/game/volleyball.svg";
import thudMp3 from "@/assets/game/thud.mp3";
import thudOgg from "@/assets/game/thud.ogg";
import paddle from "@/assets/game/paddle.svg";
import io from "socket.io-client";
import { Socket } from "socket.io-client";
export default class BootScene extends Scene {
  static socket: Socket;
  options = {
    uuid: undefined,
    key: undefined,
    mode: true,
  };

  constructor() {
    super({ key: "BootScene" });
  }

  preload() {
    const socket = io("http://localhost:3001/game", {
      withCredentials: true,
    });
    //front doit me donner les options
    socket.on("connect", () => {
      const options = this.options;
      socket.emit("options", options);
    });

    BootScene.socket = socket;

    this.load.image("sky", sky);
    this.load.svg("cercle", cercle);
    // this.load.image("ball", ball);
    // this.load.svg("ball", volleyball, { width: 100, height: 100 });
    if (this.options.mode === true) {
      // grosse balle
      this.load.svg("ball", pokeball, { width: 100, height: 100 });
    } else {
      // petite balle
      this.load.svg("ball", pokeball, { width: 18, height: 18 });
    }
    this.load.audio("thud", [thudMp3, thudOgg]);
    this.load.svg("paddle", paddle, { width: 100, height: 100 });
  }

  create() {
    this.scene.start("PlayScene");
  }
}
