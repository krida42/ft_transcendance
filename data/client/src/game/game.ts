import Phaser from "phaser";
import BootScene from "@/game/scenes/BootScene";
import PlayScene from "@/game/scenes/PlayScene";
import ErrorScene from "@/game/scenes/ErrorScene";
import WaitingScene from "./scenes/WaitingScene";

export type Options =
  | {
      uuid?: string;
      key?: string;
      mode?: boolean;
    }
  | undefined;

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

let options: Options = {
  uuid: undefined,
  key: undefined,
  mode: false,
};

export const setOptions = (optionsP?: Options) => {
  options = optionsP;
};

export const getOptions = () => options;

export default launch;
export { launch };
