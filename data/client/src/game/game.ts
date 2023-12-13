import Phaser from "phaser";
import BootScene from "@/game/scenes/BootScene";
import PlayScene from "@/game/scenes/PlayScene";
import ErrorScene from "@/game/scenes/ErrorScene";
import WaitingScene from "./scenes/WaitingScene";

function launch(containerId: any) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: containerId,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 0 },
        debug: false,
      },
    },
    scene: [BootScene, WaitingScene, PlayScene, ErrorScene],
  });
}

export default launch;
export { launch };
