import Phaser from "phaser";

export default class GameScene extends Phaser.Scene {
	ball: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
	paddle: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
	constructor() {
		super('gameScene');
	}
	preload() {
		this.load.setBaseURL('http://labs.phaser.io');
		this.load.image('ball', 'assets/ball.png');
		this.load.image('paddle', 'assets/paddle.png');
	}
	create() {
		this.ball = this.physics.add.image(400, 300, 'ball');
		this.ball.setCollideWorldBounds(true);
		this.ball.setBounce(1, 1);
		this.ball.setVelocity(200, 200);
		this.ball.setInteractive();
		this.ball.on('pointerdown', () => {
			this.ball.setVelocity(Phaser.Math.Between(-200, 200), Phaser.Math.Between(-200, 200));
		});
		this.paddle = this.physics.add.image(400, 550, 'paddle');
		this.paddle.setImmovable();
		this.physics.add.collider(this.ball, this.paddle);
	}
	update() {
		this.paddle.x = this.input.x;
	}
	
}