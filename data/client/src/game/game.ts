import Phaser from "phaser";
import BootScene from "@/game/scenes/BootScene";
import PlayScene from "@/game/scenes/PlayScene";

function launch(containerId: any) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: containerId,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 0 }, // A recuperer du cote serveur ?
        debug: false,
      },
    },
    scene: [BootScene, PlayScene],
  });
}

export default launch;
export { launch };
