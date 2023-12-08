import * as Matter from 'matter-js';
import { HEIGHT, WALL_THICKNESS, WIDTH } from '../const';
import { GameState } from '../type';
import { PongBall } from './ball';
import { PongPaddle } from './paddle';
//
export class PongWorld {
  //engine
  world: Matter.World;
  engine!: Matter.Engine;
  runner!: Matter.Runner;

  //walls
  topWall!: Matter.Body;
  bottomWall!: Matter.Body;
  leftWall!: Matter.Body;
  rightWall!: Matter.Body;

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
        y: 0,
      },
      velocityIterations: 4,
      positionIterations: 4,
    });
    this.runner = Matter.Runner.create();
  }

  run() {
    Matter.Runner.run(this.runner, this.engine);
  }

  pause() {
    Matter.Runner.stop(this.runner);
    console.log('PAUSE ENGINE');
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
    this.topWall = Matter.Bodies.rectangle(
      WIDTH / 2,
      -WALL_THICKNESS / 2,
      WIDTH,
      WALL_THICKNESS,
      options,
    );
    this.bottomWall = Matter.Bodies.rectangle(
      WIDTH / 2,
      HEIGHT + WALL_THICKNESS / 2,
      WIDTH,
      WALL_THICKNESS,
      options,
    );
    this.leftWall = Matter.Bodies.rectangle(
      -WALL_THICKNESS / 2,
      HEIGHT / 2,
      WALL_THICKNESS,
      HEIGHT,
      options,
    );
    this.rightWall = Matter.Bodies.rectangle(
      WIDTH + WALL_THICKNESS / 2,
      HEIGHT / 2,
      WALL_THICKNESS,
      HEIGHT,
      options,
    );
    Matter.World.add(this.world, [
      this.topWall,
      this.bottomWall,
      this.leftWall,
      this.rightWall,
    ]);
  }

  setupCollisions(gameState: GameState) {
    // Walls collision
    this.ballCollisionWithWalls(gameState.pongBall);
    // Paddles and Ball collision
    this.ballCollisionWithPaddle(gameState.pongPaddle1, gameState.pongBall);
    this.ballCollisionWithPaddle(gameState.pongPaddle2, gameState.pongBall);
  }

  ballCollisionWithWalls(pongBall: PongBall) {
    const ball = pongBall.ball;
    const checkCollisionWithWall = (
      bodyA: Matter.Body,
      bodyB: Matter.Body,
      wall: Matter.Body,
      wallName: string,
    ) => {
      if (
        (bodyA === ball && bodyB === wall) ||
        (bodyB === ball && bodyA === wall)
      ) {
        if (wallName === 'bas') {
          const downVelocity = Matter.Vector.create(
            ball.velocity.x,
            -ball.velocity.y,
          );
          pongBall.previousVelocity = downVelocity;
          Matter.Body.setVelocity(ball, downVelocity);
        } else if (wallName === 'haut') {
          const upVelocity = Matter.Vector.create(
            ball.velocity.x,
            -ball.velocity.y,
          );
          pongBall.previousVelocity = upVelocity;
          Matter.Body.setVelocity(ball, upVelocity);
        }
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
        checkCollisionWithWall(
          pair.bodyA,
          pair.bodyB,
          this.rightWall,
          'droite',
        );
      });
    });
  }

  ballCollisionWithPaddle(pongPaddle: PongPaddle, pongBall: PongBall) {
    const paddle = pongPaddle.paddle;
    const ball = pongBall.ball;

    const checkCollisionWithPaddle = (
      bodyA: Matter.Body,
      bodyB: Matter.Body,
      paddleBody: Matter.Body,
    ) => {
      if (
        (bodyA === ball && bodyB === paddleBody) ||
        (bodyB === ball && bodyA === paddleBody)
      ) {
        this.startEngineUpdate(pongPaddle);
        const invertedVelocity = Matter.Vector.create(
          -ball.velocity.x,
          ball.velocity.y,
        );
        pongBall.previousVelocity = invertedVelocity;
        Matter.Body.setVelocity(ball, invertedVelocity);
        // Mettre à jour la vélocité de la balle avec la vélocité inversée
        Matter.Body.setVelocity(ball, invertedVelocity);
      }
    };

    Matter.Events.on(this.engine, 'collisionStart', (event) => {
      event.pairs.forEach((pair) => {
        checkCollisionWithPaddle(pair.bodyA, pair.bodyB, paddle);
      });
    });
  }

  startEngineUpdate(pongPaddle: PongPaddle) {
    const paddle = pongPaddle.paddle;
    Matter.Events.on(this.engine, 'afterUpdate', () => {
      const position = paddle.position;
      Matter.Body.setPosition(paddle, {
        x: pongPaddle.whichPaddlePositionX(),
        y: position.y,
      }); // Modifiez cette ligne
    });
  }

  static getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
  }
}
