import * as Matter from 'matter-js';
import { HEIGHT, WIDTH } from '../const';
import { BallPong } from './ball';
import { run } from 'node:test';
// Matter.use(require('matter-wrap'));

export class WorldPong{
  world: Matter.World;
  engine: Matter.Engine;
  runner: Matter.Runner;
  topWall: Matter.Body;
  bottomWall: Matter.Body;
  leftWall: Matter.Body;
  rightWall: Matter.Body;

  constructor() {
    this.createEngine();
    this.world = this.engine.world;
    this.world.gravity.x = 0;
    this.world.gravity.y = 0;
    this.createWall();
  }

  createEngine() {
    this.engine = Matter.Engine.create(
      {
        width: WIDTH,
        height: HEIGHT,
        showAngleIndicator: true,
        gravity: {
          scale: 0,
          x: 0,
          y: 0,
        },
        timeScale: 1,
        velocityIterations: 4,
        positionIterations: 4,
        wireframes: false,
      },
    );
  }


  run() {
    this.runner = Matter.Runner.create();
    Matter.Runner.run(this.runner, this.engine);
  }

  pause(){
    Matter.Runner.stop(this.runner);
  }

  createWall() {
    const options = { 
      isStatic: true,
      };

    this.topWall = Matter.Bodies.rectangle(WIDTH / 2, 0, WIDTH, 50, options);
    this.bottomWall = Matter.Bodies.rectangle(WIDTH / 2, HEIGHT, WIDTH, 50, options);
    this.leftWall = Matter.Bodies.rectangle(0, HEIGHT / 2, 50, HEIGHT, options);
    this.rightWall = Matter.Bodies.rectangle(WIDTH, HEIGHT / 2, 50, HEIGHT, options);

    Matter.Composite.add(this.world, [this.topWall, this.bottomWall, this.leftWall, this.rightWall]);
  }

  detectCollisionWithWalls(ball: Matter.Body) {
    const checkCollisionWithWall = (bodyA: Matter.Body, bodyB: Matter.Body, wall: Matter.Body, wallName: string) => {
      if ((bodyA === ball && bodyB === wall) || (bodyB === ball && bodyA === wall)) {
        console.log(`Collision avec le mur ${wallName}`);
        if (wallName === 'du haut' || wallName === 'du bas') {
          const velocityIncrease = 1.1;
          Matter.Body.setVelocity(ball, {
            x: ball.velocity.x > 0 ? ball.velocity.x + velocityIncrease : ball.velocity.x - velocityIncrease,
            y: ball.velocity.y > 0 ? ball.velocity.y + velocityIncrease : ball.velocity.y - velocityIncrease
          });
        }
        else if (wallName === 'de gauche' || wallName === 'de droite') {
          console.log('Collision avec le mur de gauche ou de droite');
        }
      }
    };
  
    Matter.Events.on(this.engine, 'collisionStart', (event) => {
      event.pairs.forEach((pair) => {
        checkCollisionWithWall(pair.bodyA, pair.bodyB, this.topWall, 'du haut');
        checkCollisionWithWall(pair.bodyA, pair.bodyB, this.bottomWall, 'du bas');
        checkCollisionWithWall(pair.bodyA, pair.bodyB, this.leftWall, 'de gauche');
        checkCollisionWithWall(pair.bodyA, pair.bodyB, this.rightWall, 'de droite');
      });
    });
  }

  static getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
  }
}
