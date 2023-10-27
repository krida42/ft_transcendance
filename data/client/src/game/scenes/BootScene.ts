import { Scene } from "phaser";
import sky from "@/assets/game/sky.png";
import bomb from "@/assets/game/bomb.png";
import thudMp3 from "@/assets/game/thud.mp3";
import thudOgg from "@/assets/game/thud.ogg";

export default class BootScene extends Scene {
  constructor() {
    super({ key: "BootScene" });
  }

  preload() {
    this.load.image("sky", sky);
    this.load.image("bomb", bomb);
    this.load.audio("thud", [thudMp3, thudOgg]);
  }

  create() {
    this.scene.start("PlayScene");
  }
}
