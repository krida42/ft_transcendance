import * as Matter from 'matter-js';
import { HEIGHT, WALL_THICKNESS, WIDTH } from '../const';

export class PongWorld{
  //engine
  world: Matter.World;
  engine: Matter.Engine;
  runner: Matter.Runner;

  //walls
  topWall: Matter.Body;
  bottomWall: Matter.Body;
  leftWall: Matter.Body;
  rightWall: Matter.Body;

  constructor() {
    this.createEngine();
    this.world = this.engine.world;
    this.createWall();
  }

  createEngine() {
    this.engine = Matter.Engine.create({
      gravity: {
        scale: 0,
        x: 0,
        y: 0
      },
      timeScale: 1,
      velocityIterations: 4,
      positionIterations: 4,
      wireframes: false,
    },);
    this.runner = Matter.Runner.create();
  }

  run() {
    Matter.Runner.run(this.runner, this.engine);
  }

  pause() {
    Matter.Runner.stop(this.runner);
  }

  end() {
    Matter.Runner.stop(this.runner);
    Matter.World.clear(this.world, false);
    Matter.Engine.clear(this.engine);
  }

  createWall() {
    const options = {
      isStatic: true,
    };
    this.topWall = Matter.Bodies.rectangle(WIDTH / 2, -WALL_THICKNESS / 2, WIDTH, WALL_THICKNESS, options);
    this.bottomWall = Matter.Bodies.rectangle(WIDTH / 2, HEIGHT + WALL_THICKNESS / 2, WIDTH, WALL_THICKNESS, options);
    this.leftWall = Matter.Bodies.rectangle(-WALL_THICKNESS / 2, HEIGHT / 2, WALL_THICKNESS, HEIGHT, options);
    this.rightWall = Matter.Bodies.rectangle(WIDTH + WALL_THICKNESS / 2, HEIGHT / 2, WALL_THICKNESS, HEIGHT, options);
    Matter.World.add(this.world, [this.topWall, this.bottomWall, this.leftWall, this.rightWall]);
  }

  ballCollisionWithWalls(ball: Matter.Body) {
    const checkCollisionWithWall = (bodyA: Matter.Body, bodyB: Matter.Body, wall: Matter.Body, wallName: string) => {
      if ((bodyA === ball && bodyB === wall) || (bodyB === ball && bodyA === wall)) {
        // console.log(`Collision avec le mur ${wallName}`);
        if (wallName === 'gauche')
          Matter.Events.trigger(this.engine, 'score', { player: 2 });
        else if (wallName === 'droite')
          Matter.Events.trigger(this.engine, 'score', { player: 1 });
      }
    };

    Matter.Events.on(this.engine, 'collisionStart', (event) => {
      event.pairs.forEach((pair) => {
        checkCollisionWithWall(pair.bodyA, pair.bodyB, this.topWall, 'haut');
        checkCollisionWithWall(pair.bodyA, pair.bodyB, this.bottomWall, 'bas');
        checkCollisionWithWall(pair.bodyA, pair.bodyB, this.leftWall, 'gauche');
        checkCollisionWithWall(pair.bodyA, pair.bodyB, this.rightWall, 'droite');
      });
    });
  }

  static getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
  }
}
