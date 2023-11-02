import * as p2 from 'p2-es';
import { BALL_MASS, BALL_RADIUS,  BALL_VELOCITY, HEIGHT, BALL_VELOCITY_MAX, WIDTH, BALL } from '../const';
import { Ball } from '../type';
import { BALL_POSITION } from '../const';
import { WorldPong, groupCollider } from './world';


export class BallPong {
  ball: Ball = {
    body: null,
    shape: null,
  };

  constructor(private worldPong: WorldPong) {
    this.createBall();
  }

  createBall() {
		this.ball.body = new p2.Body({
			mass: BALL_MASS,
      position: BALL_POSITION,
      velocity: BALL_VELOCITY,
      angularVelocity: 0,
      damping: 0,
      angularDamping: 0,
    });
		this.ball.shape = new p2.Circle({ radius: BALL_RADIUS });
    groupCollider(this.ball.shape, BALL);
    this.ball.shape.material = new p2.Material();
		this.ball.body.addShape(this.ball.shape);
		this.worldPong.world.addBody(this.ball.body);
  }


  touchWallIncreaseVelocity() {
    const ball = this.ball.body.shapes[0];
    const world = this.worldPong.world;
    const topWall = this.worldPong.topWall;
    const bottomWall = this.worldPong.bottomWall;
    const leftWall = this.worldPong.leftWall;
    const rightWall = this.worldPong.rightWall;

    var ballWallContactMaterial = 
    new p2.ContactMaterial(ball.material, this.worldPong.wallMaterial, {
      restitution: 1.0, // Use high restitution to make the ball bounce.
      friction: 0,      // Use some friction.
    });
    world.addContactMaterial(ballWallContactMaterial);

    world.on('beginContact', (event) => {
      
      if (event.bodyA === this.ball.body || event.bodyB === this.ball.body) {
          // La balle est en collision avec un autre corps
          let otherBody = event.bodyA === this.ball.body ? event.bodyB : event.bodyA;
  
          if (otherBody === topWall || otherBody === bottomWall) {
              // La balle est en collision avec le mur du haut ou du bas
              // Inverse la vélocité en y pour faire rebondir la balle
              this.increaseBallVelocity(1);
              console.log("Contact");
            } else if (otherBody === leftWall || otherBody === rightWall) {
              // La balle est en collision avec le mur de gauche ou de droite
              // Inverse la vélocité en x pour faire rebondir la balle
              this.increaseBallVelocity(0);
          }
      }
  });
    // let wall = this.worldPong.isTouchingWall(ball);
    // if (wall) {
    //   console.log("Touche le mur:", wall.id);
    //   if (wall === this.worldPong.topWall || wall === this.worldPong.bottomWall) {
    //     this.increaseBallVelocity(1);
    //   } else if (wall === this.worldPong.leftWall || wall === this.worldPong.rightWall) {
    //     this.increaseBallVelocity(0);
    //   }
    // }
  }
  
	increaseBallVelocity(axe: number) {
    const ball = this.ball.body;

    if (Math.abs(ball.velocity[axe]) >= BALL_VELOCITY_MAX) {
      ball.velocity[axe] = BALL_VELOCITY_MAX * Math.sign(ball.velocity[axe]);
      return;
    }
    ball.velocity[axe] = -ball.velocity[axe] * 1.01;
	}

  getBallPosition(): p2.Vec2 {
    return this.ball.body.position;
  }

  getBallVelocity(): p2.Vec2 {
    return this.ball.body.velocity;
  }

  setBallPosition(position: p2.Vec2) {
    this.ball.body.position = position;
  }
}