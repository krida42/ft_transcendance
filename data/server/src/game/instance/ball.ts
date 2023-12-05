import * as Matter from 'matter-js';
import { BALL_RADIUS, HEIGHT, WIDTH } from '../const';
import { PongWorld } from './world';
import { randomInt } from 'crypto';

export class PongBall {
  ball: Matter.Body;
  acceleration: number = 0.0001;
  previousVelocity: Matter.Vector;

  constructor(private pongWorld: PongWorld) {
    this.createBall();
  }

  createBall() {
    let fX = 0;
    let fY = 0;
    this.ball = Matter.Bodies.circle(WIDTH / 2, HEIGHT / 2, BALL_RADIUS, {
      friction: 0,
      restitution: 0.5,
      frictionAir: 0,
      frictionStatic: 0,
      density: 0.01,
    });
    Matter.World.add(this.pongWorld.world, this.ball);
    randomInt(0, 2) === 0 ? fX = 0.1 : fX = -0.1;
    randomInt(0, 2) === 0 ? fY = 0.1 : fY = -0.1;
    const force = { x: fX, y: fY }; // y a changer a 0y
    Matter.Body.applyForce(this.ball, this.ball.position, force);
  }

  update() {
    // this.acceleration += 0.0001;
    // const vX = this.ball.velocity.x + (this.ball.velocity.x > 0 ? this.acceleration : -this.acceleration);
    // const vY = this.ball.velocity.y + (this.ball.velocity.y > 0 ? this.acceleration : -this.acceleration);
    // Matter.Body.setVelocity(this.ball, { x: vX, y: vY });
  }

  resetPosition() {
    this.acceleration = 0.0001;
    Matter.Body.setVelocity(this.ball, { x: 0, y: 0 });
    Matter.Body.setAngularVelocity(this.ball, 0);
    
    let fX = 0;
    let fY = 0;
    setTimeout(() => {
      Matter.Body.setPosition(this.ball, { x: WIDTH / 2, y: HEIGHT / 2 });
      randomInt(0, 2) === 0 ? fX = 0.1 : fX = -0.1;
      randomInt(0, 2) === 0 ? fY = 0.1 : fY = -0.1;
      const force = { x: fX, y: fY };
      Matter.Body.applyForce(this.ball, this.ball.position, force);
    }, 10);
  }

  // startBallAcceleration() {
  //   const speedIncreasePerFrame = 0.001; // Vous pouvez ajuster cette valeur
  
  //   Matter.Events.on(this.pongWorld.engine, 'beforeUpdate', () => {
  //     // Sauvegarder la vitesse précédente
  //     this.previousVelocity = { ...this.ball.velocity };
  //   });
  
  //   Matter.Events.on(this.pongWorld.engine, 'afterUpdate', () => {
  //     // Rétablir la vitesse de la balle à sa valeur précédente
  //     Matter.Body.setVelocity(this.ball, this.previousVelocity);
  
  //     // Augmenter la vitesse de la balle
  //     Matter.Body.setVelocity(this.ball, {
  //       x: this.ball.velocity.x + (this.ball.velocity.x > 0 ? speedIncreasePerFrame : -speedIncreasePerFrame),
  //       y: this.ball.velocity.y + (this.ball.velocity.y > 0 ? speedIncreasePerFrame : -speedIncreasePerFrame)
  //     });
  //   });
  // }
}
