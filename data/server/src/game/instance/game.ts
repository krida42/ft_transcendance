import { GameState } from "../type";
import { PongGateway } from "../websocket/pong.gateway";
import { GameInit } from "./gameInit";

export class Game {
  id: number = 0;
  gameList: GameState[] = [];
  pongGateway: PongGateway;
  gameInterval: NodeJS.Timeout;
  displayInterval: NodeJS.Timeout;
  lastTime: number = 0;

  constructor(PongGateway: PongGateway) {
    this.id++;
    this.pongGateway = PongGateway;
    this.gameList.push(GameInit.initGameState());
  }

  start() {
    this.gameList[0].worldPong.run();
    this.gameInterval = setInterval(() => this.sendBallClient(), 1);
  }

  sendBallClient() {
    const ball = this.gameList[0].ballPong.ball.position;
    if (this.gameList[0].worldPong.engine.timing.timestamp - this.lastTime >= 1) {
      this.pongGateway.sendBall(ball);
      console.log("position: ", this.gameList[0].ballPong.ball.velocity);
      this.lastTime = this.gameList[0].worldPong.engine.timing.timestamp;
    }
  }

  pause() {
    this.gameList[0].worldPong.pause();
    clearInterval(this.gameInterval);
  }
}