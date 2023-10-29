import { Scene } from "phaser";

export default class PlayScene extends Scene {
  constructor() {
    super({ key: "PlayScene" });
  }

  create() {
    this.add.image(400, 300, "sky");

    const bomb = this.physics.add.image(400, 200, "bomb");
    bomb.setCollideWorldBounds(true);
    bomb.body.onWorldBounds = true; // enable worldbounds collision event
    bomb.setBounce(1);
    bomb.setVelocity(200, 20);

    this.sound.add("thud");
    this.physics.world.on("worldbounds", () => {
      this.sound.play("thud", { volume: 0.75 });
    });

    const paddle = this.physics.add.image(300, 500, "paddle");
    paddle.setScale(0.5);
    paddle.setImmovable(true);
    paddle.setCollideWorldBounds(true);
    paddle.body.allowGravity = false;
    paddle.body.immovable = true;
    paddle.body.moves = false;

    this.physics.add.collider(bomb, paddle);
  }

  update() {
    console.log("update");
  }
}
