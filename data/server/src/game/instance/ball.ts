import * as Matter from 'matter-js';
import { BALL_RADIUS, HEIGHT, WIDTH } from '../const';
import { WorldPong } from './worldPong';
import { randomInt } from 'crypto';

export class BallPong {
  ball: Matter.Body;

  constructor(private worldPong: WorldPong) {
    this.createBall();
    this.collisonWithWall();
  }

  createBall() {
    let fX = 0;
    this.ball = Matter.Bodies.circle(WIDTH / 2, HEIGHT / 2, BALL_RADIUS, {
      restitution: 1.0, 
      friction: 0,
      frictionAir: 0,
      frictionStatic: 0,
      density: 0.001,
    });
    Matter.World.add(this.worldPong.world, this.ball);
    randomInt(0, 1) === 0 ? fX = 0.001 : fX = -0.001;
    const force = { x: fX, y: 0.001 }; // y a changer a 0
    Matter.Body.applyForce(this.ball, this.ball.position, force);
  }

  collisonWithWall() {
    this.worldPong.detectCollisionWithWalls(this.ball);
  }

  // touchWallIncreaseVelocity() {
  //   const ball = this.ball.body.shapes[0];
  // } 
}