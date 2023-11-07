import * as Matter from 'matter-js';
export class PaddlePong {
	paddle: Matter.Body;

	constructor() {
		this.createPaddle();
	}

	createPaddle() {
		this.paddle = Matter.Bodies.rectangle(0, 0, 10, 100, {
			isStatic: true,
			restitution: 1,
			friction: 0,
		});
	}
}