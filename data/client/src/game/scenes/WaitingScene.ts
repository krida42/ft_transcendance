import { Scene } from "phaser";

export default class WaitingScene extends Scene {
  constructor() {
    super({ key: "WaitingScene" });
  }

  create() {
    // Affichez un message d'attente ou une animation pour indiquer aux joueurs qu'ils doivent attendre
    const text = this.add.text(400, 300, "En attente de l'autre joueur...", {
      font: "24px Arial",
      color: "#ffffff",
    });
    text.setOrigin(0.5);
  }
}
