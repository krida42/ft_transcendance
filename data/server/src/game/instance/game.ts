import { PongRoom } from '../lobby/room';
import { GameState } from "../type";
import { GameInit } from "./gameInit";

export class Game {
  PongRoom: PongRoom;
  id: number = 0;
  gameState: GameState;
  gameInterval: NodeJS.Timeout;
  startTime: number = 0;
  timeInterval: NodeJS.Timeout;
  displayInterval: NodeJS.Timeout;
  lastTime: number = 0;
  finished: boolean = false;

  constructor(PongRoom: PongRoom) {
    this.id++;
    this.PongRoom = PongRoom;
    this.gameState = GameInit.initGameState();
  }

  start() {
    this.gameState.pongWorld.run();
    this.startTime = Date.now();
    this.gameInterval = setInterval(() => this.sendStatusGameClient(), 1);
    this.timeInterval = setInterval(() => this.sendTimeGame(), 100);
  }

  sendStatusGameClient() {
    const ball = this.gameState.pongBall.ball.position;
    if (this.gameState.pongWorld.engine.timing.timestamp - this.lastTime >= 1) {
      this.PongRoom.sendBallPosition(ball);
      this.PongRoom.sendPaddlePosition([this.gameState.pongPaddle1.paddle.position.x,
        this.gameState.pongPaddle1.paddle.position.y], 1);
      this.PongRoom.sendPaddlePosition([this.gameState.pongPaddle2.paddle.position.x,
        this.gameState.pongPaddle2.paddle.position.y], 2);
      this.lastTime = this.gameState.pongWorld.engine.timing.timestamp;
    }
  }
  
  sendTimeGame() {
    const currentTime = Date.now();
    const elapsedTime = (currentTime - this.startTime) / 1000; // time in seconds
    this.PongRoom.sendTime(elapsedTime);
  }

  moveDown(player: number) {
    if (player === 1)
      this.gameState.pongPaddle1.moveDown();
    else
      this.gameState.pongPaddle2.moveDown();
  }

  moveUp(player: number) {
    if (player === 1)
      this.gameState.pongPaddle1.moveUp();
    else
      this.gameState.pongPaddle2.moveUp();
  }
  
  end() {
    this.finished = true;
    clearInterval(this.gameInterval);
  }

  pause() {
    this.gameState.pongWorld.pause();
    clearInterval(this.gameInterval);
  }
}