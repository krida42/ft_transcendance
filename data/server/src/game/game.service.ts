import { Injectable } from '@nestjs/common';
import * as p2 from 'p2-es';
import { GameState } from './type';
import { HEIGHT, WIDTH, BALL_MASS, BALL_RADIUS, BALL_POSITION,
   TIMESTEP, MAXSTEP, BALL_VELOCITY, SCORE_TO_WIN } from './const';
    
  let LASTTIME = Date.now();

@Injectable()
export class GameService {
  private world: p2.World;
  private gameState: GameState;
    
  constructor() {  
  }

  initWorld() {
    this.world = new p2.World({
      gravity: [0, 0]
    });
    console.log('GameService created');
    this.initGameState();
    this.createBall();
    this.createWalls();
  }

  initGameState() {
    this.gameState = {
      scoreToWin: SCORE_TO_WIN,
      score1: 0,
      score2: 0,
      ball: null,
      Player1: null,
      Player2: null,
    };
  }

  createBall() {
    const ballBody = new p2.Body({
      mass: BALL_MASS,
      position: BALL_POSITION,
    });
    var ballShape = new p2.Circle({ radius: BALL_RADIUS });
    ballBody.addShape(ballShape);
    this.world.addBody(ballBody);
    
    ballBody.velocity = [BALL_VELOCITY, BALL_VELOCITY];
    this.gameState.ball = ballBody;
  }

  upWall() {
    const wallTop = new p2.Body({ mass: 0 });
    const wallTopShape = new p2.Plane();
    wallTop.addShape(wallTopShape);
    wallTop.position = [0, 0];
    this.world.addBody(wallTop);
  }

  downWall() {
    const wallBottom = new p2.Body({ mass: 0 });
    const wallBottomShape = new p2.Plane();
    wallBottom.addShape(wallBottomShape);
    wallBottom.position = [0, HEIGHT];
    this.world.addBody(wallBottom);
  }

  createWalls() {
    this.upWall();
    this.downWall();
  }

  renderCircleAtPosition(position: p2.Vec2) {
    console.log(`Ball position: ${position}`);
  }

  touchWall() {
    if (this.gameState.ball.position[1] - (this.gameState.ball.shapes[0] as p2.Circle).radius <= 0 || 
    this.gameState.ball.position[1] + (this.gameState.ball.shapes[0] as p2.Circle).radius >= HEIGHT) {
      // Invert the vertical direction of the ball and increase its velocity
      this.gameState.ball.velocity[1] = -this.gameState.ball.velocity[1];
      this.increaseBallVelocity();
      }
  }

  // Compute elapsed time since last render frame
  // Move bodies forward in time
  // Render the circle at the current interpolated position
  update() {
    const currentTime = Date.now();
    const deltaTime = (currentTime - LASTTIME) / 1000;
    
    this.world.step(TIMESTEP, deltaTime, MAXSTEP);
    // Check if the ball hits the top or bottom wall
    this.touchWall();
    this.renderCircleAtPosition(this.gameState.ball.position);
    

    LASTTIME = currentTime;
  }

  increaseBallVelocity() {
    const currentVelocity = this.gameState.ball.velocity;
    const newVelocity = [currentVelocity[0] * 1.1, currentVelocity[1] * 1.1];
    this.gameState.ball.velocity = newVelocity;
  }

  // Démarrer la boucle de jeu
  start() {
    console.log('Game started');
    this.animationInterval = setInterval(() => this.update(), 1000 / 60);
  }

  // Arrêter la boucle de jeu
  stop() {
    console.log('Game stopped');
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }
  }

  private animationInterval: NodeJS.Timeout;
  }

