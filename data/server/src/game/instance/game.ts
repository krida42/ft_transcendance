import { MAXSTEP, TIMESTEP } from "../const";
import { GameState } from "../type";
import { PongGateway } from '../websocket/pong.gateway';
import { GameInit } from "./gameInit";

let LASTTIME = Date.now();
export class Game {
  id: number = 0;
  gameState: GameState;
  pongGateway: PongGateway;

	constructor(PongGateway: PongGateway) {
    this.id++;
    this.pongGateway = PongGateway;
    this.gameState = GameInit.initGameState();
  }
  
  update() {
    const currentTime = Date.now();
    const deltaTime = (currentTime - LASTTIME) / 1000;
    const ballPong = this.gameState.ballPong;

    console.log("Pos=", ballPong.getBallPosition());
    // console.log("Vel=", ballPong.getBallVelocity());
    // console.log("Vel=", ballPong.getBallVelocity());
    
    this.gameState.worldPong.world.step(TIMESTEP, deltaTime, MAXSTEP);
    
    // Check if the ball hits the top or bottom wall
    ballPong.touchWallIncreaseVelocity();
    // console.log("Pos=", ballPong.getBallPosition());
    this.pongGateway.sendBall(ballPong.getBallPosition());

    LASTTIME = currentTime;
  }

  private animationInterval: NodeJS.Timeout;
  // Démarrer la boucle de jeu
  start() {
    console.log('Game started:', this.id);
    this.animationInterval = setInterval(() => this.update(), 1000 / 60);
  }

  // Arrêter la boucle de jeu
  stop() {
    console.log('Game stopped:', this.id);
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }
  }
}
