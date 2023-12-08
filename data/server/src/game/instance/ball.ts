import * as Matter from 'matter-js';
import { BALL_RADIUS, HEIGHT, WIDTH } from '../const';
import { PongWorld } from './world';
import { randomInt } from 'crypto';

export class PongBall {
  ball!: Matter.Body;
  acceleration: number = 0.1;
  previousVelocity!: Matter.Vector;

  constructor(private pongWorld: PongWorld) {
    this.createBall();
  }

  createBall() {
    let fX = 0;
    let fY = 0;
    this.ball = Matter.Bodies.circle(WIDTH / 2, HEIGHT / 2, BALL_RADIUS, {
      density: 0.01,
    });
    Matter.World.add(this.pongWorld.world, this.ball);
    randomInt(0, 2) === 0 ? (fX = 1) : (fX = -1);
    randomInt(0, 2) === 0 ? (fY = 1) : (fY = -1);
    const force = { x: fX, y: fY };
    Matter.Body.setVelocity(this.ball, force);
  }

  resetPosition() {
    Matter.Body.setAngularVelocity(this.ball, 0);
    this.previousVelocity = { x: 1, y: 1 };
    Matter.Body.setVelocity(this.ball, { x: 1, y: 1 });

    let fX = 0;
    let fY = 0;
    setTimeout(() => {
      Matter.Body.setPosition(this.ball, { x: WIDTH / 2, y: HEIGHT / 2 });
      randomInt(0, 2) === 0 ? (fX = 1) : (fX = -1);
      randomInt(0, 2) === 0 ? (fY = 1) : (fY = -1);
      const force = { x: fX, y: fY };
      Matter.Body.applyForce(this.ball, this.ball.position, force);
    }, 10);
  }

  startBallAcceleration() {
    const speedIncreasePerFrame = 0.001;

    Matter.Events.on(this.pongWorld.engine, 'beforeUpdate', () => {
      // Sauvegarder la vitesse précédente
      this.previousVelocity = { ...this.ball.velocity };
    });

    Matter.Events.on(this.pongWorld.engine, 'afterUpdate', () => {
      // Rétablir la vitesse de la balle à sa valeur précédente
      Matter.Body.setVelocity(this.ball, this.previousVelocity);
      // Augmenter la vitesse de la balle
      Matter.Body.setVelocity(this.ball, {
        x: this.ball.velocity.x * (1 + speedIncreasePerFrame),
        y: this.ball.velocity.y * (1 + speedIncreasePerFrame),
      });
    });
  }
}
