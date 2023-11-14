import * as Matter from 'matter-js';
import { BALL_RADIUS, HEIGHT, WIDTH } from '../const';
import { PongWorld } from './world';
import { randomInt } from 'crypto';

export class PongBall {
  ball: Matter.Body;

  constructor(private pongWorld: PongWorld) {
    this.createBall();
    this.collisonWithWall();
  }

  createBall() {
    let fX = 0;
    this.ball = Matter.Bodies.circle(WIDTH / 2, HEIGHT / 2, BALL_RADIUS, {
      restitution: 1, 
      friction: 0,
      frictionAir: 0,
      frictionStatic: 0,
      density: 0.001,
    });
    Matter.World.add(this.pongWorld.world, this.ball);
    randomInt(0, 2) === 0 ? fX = 0.001 : fX = -0.001;
    const force = { x: fX, y: 0.001 }; // y a changer a 0y
    Matter.Body.applyForce(this.ball, this.ball.position, force);
  }

  collisonWithWall() {
    this.pongWorld.ballCollisionWithWalls(this.ball);
  }
}