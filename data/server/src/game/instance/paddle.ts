import * as Matter from 'matter-js';
import { PongWorld } from './world';
import { PADDLE_HEIGHT, PADDLE_VELOCITY, PADDLE_WIDTH, POSITION_PADDLE_1_x, POSITION_PADDLE_1_y, POSITION_PADDLE_2_x, POSITION_PADDLE_2_y } from '../const';

export class PongPaddle {
  paddle: Matter.Body;
  private speed = PADDLE_VELOCITY;

  constructor(private pongWorld: PongWorld, private player: number) {
    this.createPaddle();
    // this.collisionWithWall();
  }
  
  createPaddle() {
    this.paddle = Matter.Bodies.rectangle(
      0, 0, PADDLE_WIDTH, PADDLE_HEIGHT, {
      restitution: 1,
      friction: 0,
      frictionAir: 0,
      frictionStatic: 0,
      density: 0.001,
      inertia: Infinity,
    });
    if (this.player === 1)
      Matter.Body.setPosition(this.paddle, { x: POSITION_PADDLE_1_x, y: POSITION_PADDLE_1_y });
    else
      Matter.Body.setPosition(this.paddle, { x: POSITION_PADDLE_2_x, y: POSITION_PADDLE_2_y });
    Matter.World.add(this.pongWorld.world, this.paddle);
  }

  moveUp() {
    Matter.Body.setVelocity(this.paddle, { x: 0, y: -this.speed });
  }

  moveDown() {
    Matter.Body.setVelocity(this.paddle, { x: 0, y: this.speed });
  }

  collisionWithWall() {
    // this.pongWorld.ballCollisionWithWalls(this.paddle);
  }
}