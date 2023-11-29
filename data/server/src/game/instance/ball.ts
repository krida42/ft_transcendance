import * as Matter from 'matter-js';
import { BALL_RADIUS, HEIGHT, WIDTH } from '../const';
import { PongWorld } from './world';
import { randomInt } from 'crypto';

export class PongBall {
  ball: Matter.Body;
  acceleration: number = 0.0001;

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
      density: 1,
    });
    Matter.World.add(this.pongWorld.world, this.ball);
    randomInt(0, 2) === 0 ? fX = 1 : fX = -1;
    const force = { x: fX, y: 1 }; // y a changer a 0y
    Matter.Body.applyForce(this.ball, this.ball.position, force);
  }

  update() {
    this.acceleration += 0.0001;
    const fX = this.ball.velocity.x * this.acceleration;
    const fY = this.ball.velocity.y * this.acceleration;
    const force = { x: fX, y: fY };
    Matter.Body.applyForce(this.ball, this.ball.position, force);
  }

  resetPosition() {
    this.acceleration = 0.0001;
    this.ball.velocity.x = 0;
    this.ball.velocity.y = 0;
    Matter.Body.setPosition(this.ball, { x: WIDTH / 2, y: HEIGHT / 2 });
    
    let fX = 0;
    let fY = 0;
    randomInt(0, 2) === 0 ? fX = 0.01 : fX = -0.01;
    randomInt(0, 2) === 0 ? fY = 0.01 : fY = -0.01;
    const force = { x: fX, y: fY };
    Matter.Body.applyForce(this.ball, this.ball.position, force);
  }

  collisonWithWall() {
    this.pongWorld.ballCollisionWithWalls(this.ball);
  }
}