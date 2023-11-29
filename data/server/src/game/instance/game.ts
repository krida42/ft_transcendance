import { clear } from 'console';
import { SCORE_TO_WIN, TIME_END_GAME } from '../const';
import { PongRoom } from '../lobby/room';
import { GameState } from "../type";
import { GameInit } from "./gameInit";
import * as Matter from 'matter-js';

export class Game {
  //game state engine
  running: boolean = false;
  accelerationBallInterval: NodeJS.Timeout;

  //game
  scorePlayer1: number = 0;
  scorePlayer2: number = 0;
  finished: boolean = false;
  remainingTime: number = 0;
  timeEndGame: NodeJS.Timeout;
  
  //room and status
  static id: number = 0;
  pongRoom: PongRoom;
  gameState: GameState;
  
  //send
  lastTime: number = 0;
  gameInterval: NodeJS.Timeout;
  timeInterval: NodeJS.Timeout;

  constructor(PongRoom: PongRoom) {
    Game.id++;
    this.pongRoom = PongRoom;
    this.gameState = GameInit.initGameState();
    this.setupScoreEvent();
  }

  setupTimeEndGame(timeEndGame: number = TIME_END_GAME) {
    this.timeEndGame = setTimeout(() => {
      this.running = false;
      this.declareWinner();
      this.endGame();
    }, timeEndGame);
  }

  start() {
    this.gameState.pongWorld.run();
    this.running = true;
    if (this.pongRoom.startTime === 0)
      this.pongRoom.startTime = Date.now();
    this.setupIntervals();
    this.setupTimeEndGame();
  }

  pause() {
    if (this.running) {
      this.running = false;
      this.gameState.pongWorld.pause();
      this.clearIntervals();
      this.sendGamePaused();
      this.pongRoom.pauseTime = Date.now();
      this.remainingTime = TIME_END_GAME - (this.pongRoom.pauseTime - this.pongRoom.startTime);
      clearTimeout(this.timeEndGame);
    }
  }

  resume() {
    if (!this.gameState.pongWorld.engine.timing.isRunning) {
      this.running = true;
      this.gameState.pongWorld.run();
      this.setupIntervals();
      this.sendGameResumed();
      this.resumeTime();
    }
  }

  calculateRemainingTime() {
    const currentTime = Date.now();
    var elapsedTime = (currentTime - this.pongRoom.startTime);
    elapsedTime -= this.pongRoom.totalPauseTime;
    const remainingTime = TIME_END_GAME - elapsedTime;
    return remainingTime;
  }

  resumeTime() {
    const pauseDuration = Date.now() - this.pongRoom.pauseTime;
    this.pongRoom.totalPauseTime += pauseDuration;

    this.setupTimeEndGame(this.calculateRemainingTime());
  }

  end() {
    this.finished = true;
    this.clearIntervals();
    this.gameState.pongWorld.end();
  }

  endGame() {
    this.pongRoom.isGameEnded = true;
    this.running = false;
    this.pongRoom.close();
    this.end();
  }

  resetPositions() {
    this.gameState.pongBall.resetPosition();
    this.gameState.pongPaddle1.resetPosition();
    this.gameState.pongPaddle2.resetPosition();
  }

  setupScoreEvent() {
    Matter.Events.on(this.gameState.pongWorld.engine, 'score', (event) => {
      this.updateScore(event);
      this.resetPositions();
    });
  }

  updateScore(event) {
    if (event.player === 1)
      this.scorePlayer1++;
    else if (event.player === 2)
      this.scorePlayer2++;
    const score: [number, number] = [this.scorePlayer1, this.scorePlayer2];
    this.pongRoom.sendScore(score);
    this.pongRoom.GameState.score = score;
  
    if (this.scorePlayer1 >= SCORE_TO_WIN || this.scorePlayer2 >= SCORE_TO_WIN) {
      this.declareWinner();
      this.endGame();
    }
  }

  setupIntervals() {
    this.gameInterval = setInterval(() => this.sendStatusGameClient(), 1);
    this.timeInterval = setInterval(() => this.sendTimeGame(), 100);
    this.accelerationBallInterval = setInterval(() => this.accelerationBall(), 1000);
  }

  accelerationBall() {
    this.gameState.pongBall.update();
  }

  clearIntervals() {
    clearInterval(this.gameInterval);
    clearInterval(this.timeInterval);
  }

  sendStatusGameClient() {
    const ball = this.gameState.pongBall.ball.position;
    if (this.gameState.pongWorld.engine.timing.timestamp - this.lastTime >= 1) {
      this.sendPositions(ball);
      this.lastTime = this.gameState.pongWorld.engine.timing.timestamp;
    }
  }

  // Send positions of ball and paddles
  sendPositions(ball) {
    this.sendBallPosition(ball);
    this.sendPaddlePosition([this.gameState.pongPaddle1.paddle.position.x,
      this.gameState.pongPaddle1.paddle.position.y], 1);
    this.sendPaddlePosition([this.gameState.pongPaddle2.paddle.position.x,
      this.gameState.pongPaddle2.paddle.position.y], 2);
  }

  sendBallPosition(ball) {
    this.pongRoom.sendBallPosition(ball);
  }

  sendPaddlePosition(position: [number, number], player: number) {
    this.pongRoom.sendPaddlePosition(position, player);
  }

  sendTimeGame() {
    const time = this.calculateRemainingTime() / 1000;
    this.pongRoom.sendTime(time);
    // console.log('time', time);
  }

  sendGamePaused() {
    this.pongRoom.sendGamePaused();
  }

  sendGameResumed() {
    this.pongRoom.sendGameResumed();
  }

  declareWinner() {
    if (this.scorePlayer1 > this.scorePlayer2)
      this.declarePlayerWinner(0, 1);
    else if (this.scorePlayer2 > this.scorePlayer1)
      this.declarePlayerWinner(1, 0);
    else
      this.declareDraw();
    this.endGame();
  }

  declarePlayerWinner(winnerIndex: number, loserIndex: number) {
    if (winnerIndex >= 0 && winnerIndex < this.pongRoom.players.length &&
        loserIndex >= 0 && loserIndex < this.pongRoom.players.length) {
      this.pongRoom.players[winnerIndex].client.emit('winner');
      this.pongRoom.players[loserIndex].client.emit('loser');
    } else {
      console.error('Invalid player index');
    }
  }

  declarePlayerWinnerForDeconnection(winnerIndex: number) {
    if (winnerIndex >= 0 && winnerIndex < this.pongRoom.players.length)
    {
      this.pongRoom.players[winnerIndex].client.emit('winner');
      this.endGame();
    }
    else {
      console.error('Invalid player index');
    }
  }

  declareDraw() {
    this.pongRoom.players.forEach(player => player.client.emit('draw'));
  }

  declareAbandon() {
    this.endGame();
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
}
