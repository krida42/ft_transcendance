import { Scene } from "phaser";
import BootScene from "./BootScene";

export default class WaitingScene extends Scene {
  isWaiting = true;

  constructor() {
    super({ key: "WaitingScene" });
  }

  create() {
    // const socket = BootScene.socket;
    // socket.on("waiting", (isWaiting: boolean) => {
    //   if (isWaiting === false) {
    //     this.scene.start("PlayScene");
    //     this.scene.stop("WaitingScene");
    //   }
    // });

    // Affichez un message d'attente ou une animation pour indiquer aux joueurs qu'ils doivent attendre
    const text = this.add.text(400, 300, "En attente de l'autre joueur...", {
      font: "24px Arial",
      color: "#ffffff",
    });
    text.setOrigin(0.5);
  }
}
