import { SCORE_TO_WIN, TIME_END_GAME } from '../const';
import { PongRoom } from '../lobby/room';
import { GameState } from '../type';
import { GameInit } from './gameInit';
import * as Matter from 'matter-js';
export class Game {
  //game state engine
  running: boolean = false;
  accelerationBallInterval!: NodeJS.Timeout;

  //game
  scorePlayer1: number = 0;
  scorePlayer2: number = 0;
  finished: boolean = false;
  remainingTime: number = 0;
  timeEndGame!: NodeJS.Timeout;

  //room and status
  static id: number = 0;
  pongRoom: PongRoom;
  gameState: GameState;

  //send
  lastTime: number = 0;
  gameInterval!: NodeJS.Timeout;
  timeInterval!: NodeJS.Timeout;

  //save into db
  timeAtEnd: number = 0;

  //mode
  // mode: boolean = false;

  constructor(PongRoom: PongRoom) {
    Game.id++;
    this.pongRoom = PongRoom;
    // console.log('PongRoom mode:', PongRoom.mode);
    // console.log('Game key:', PongRoom?.key);
    this.gameState = GameInit.initGameState(this.pongRoom.mode);
    this.setupScoreEvent();
  }

  async setupTimeEndGame(timeEndGame: number = TIME_END_GAME) {
    this.timeEndGame = setTimeout(async () => {
      this.running = false;
      await this.declareWinner();
      await this.endGame();
    }, timeEndGame);
  }

  async start() {
    this.gameState.pongWorld.run();
    this.gameState.pongBall.startBallAcceleration();
    this.running = true;
    if (this.pongRoom.startTime === 0) this.pongRoom.startTime = Date.now();
    this.setupIntervals();
    await this.setupTimeEndGame();
  }

  pause() {
    if (this.running) {
      this.running = false;
      this.gameState.pongWorld.pause();
      this.clearIntervals();
      this.sendGamePaused();
      this.pongRoom.pauseTime = Date.now();
      this.remainingTime =
        TIME_END_GAME - (this.pongRoom.pauseTime - this.pongRoom.startTime);
      clearTimeout(this.timeEndGame);
    }
  }

  async resume() {
    this.running = true;
    this.gameState.pongWorld.run();
    this.setupIntervals();
    this.sendGameResumed();
    await this.resumeTime();
  }

  calculateRemainingTime() {
    const currentTime = Date.now();
    var elapsedTime = currentTime - this.pongRoom.startTime;
    elapsedTime -= this.pongRoom.totalPauseTime;
    const remainingTime = TIME_END_GAME - elapsedTime;
    return remainingTime;
  }

  async resumeTime() {
    const pauseDuration = Date.now() - this.pongRoom.pauseTime;
    this.pongRoom.totalPauseTime += pauseDuration;

    await this.setupTimeEndGame(this.calculateRemainingTime());
  }

  end() {
    this.finished = true;
    this.clearIntervals();
    this.gameState.pongWorld.end();
  }

  async endGame() {
    this.pongRoom.isGameEnded = true;
    this.running = false;
    if (this.pongRoom.PlayerManager.isAllPlayersDisconnected()) {
      console.log('WITHOUT SAVE');
      this.pongRoom.closeWithoutSave();
    } else if (this.pongRoom.PlayerManager.disconnectPlayers.size > 0)
      await this.pongRoom.close();
    else await this.pongRoom.closeWithAchievement();
    this.end();
  }

  resetPositions() {
    this.gameState.pongBall.resetPosition();
    this.gameState.pongPaddle1.resetPosition();
    this.gameState.pongPaddle2.resetPosition();
  }

  setupScoreEvent() {
    Matter.Events.on(this.gameState.pongWorld.engine, 'score', async (event) => {
      await this.updateScore(event);
      this.resetPositions();
    });
  }

  async updateScore(event: any) {
    if (event.player === 1) this.scorePlayer1++;
    else if (event.player === 2) this.scorePlayer2++;
    const score: [number, number] = [this.scorePlayer1, this.scorePlayer2];
    this.pongRoom.sendScore(score);
    this.gameState.score = score;

    if (this.scorePlayer1 >= SCORE_TO_WIN || this.scorePlayer2 >= SCORE_TO_WIN)
      await this.declareWinner();
  }

  setupIntervals() {
    this.gameInterval = setInterval(() => this.sendStatusGameClient(), 1);
    this.timeInterval = setInterval(() => this.sendTimeGame(), 100);
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
  sendPositions(ball: Matter.Vector) {
    this.sendBallPosition(ball);
    this.sendPaddlePosition(
      [
        this.gameState.pongPaddle1.paddle.position.x,
        this.gameState.pongPaddle1.paddle.position.y,
      ],
      1,
    );
    this.sendPaddlePosition(
      [
        this.gameState.pongPaddle2.paddle.position.x,
        this.gameState.pongPaddle2.paddle.position.y,
      ],
      2,
    );
  }

  sendBallPosition(ball: Matter.Vector) {
    this.pongRoom.sendBallPosition(ball);
  }

  sendPaddlePosition(position: [number, number], player: number) {
    this.pongRoom.sendPaddlePosition(position, player);
  }

  sendTimeGame() {
    const time = this.calculateRemainingTime() / 1000;
    this.pongRoom.sendTime(time);
    this.timeAtEnd = TIME_END_GAME / 1000 - time;
    this.pongRoom.sendScore([this.scorePlayer1, this.scorePlayer2]);
    this.pongRoom.sendMode(this.pongRoom.mode);
    // console.log('time', time);
  }

  sendGamePaused() {
    this.pongRoom.sendGamePaused();
  }

  sendGameResumed() {
    this.pongRoom.sendGameResumed();
  }

  async declareWinner() {
    if (this.scorePlayer1 > this.scorePlayer2) this.declarePlayerWinner(0, 1);
    else if (this.scorePlayer2 > this.scorePlayer1)
      this.declarePlayerWinner(1, 0);
    else this.declareDraw();
    await this.endGame();
  }

  declarePlayerWinner(winnerIndex: number, loserIndex: number) {
    if (
      winnerIndex >= 0 &&
      winnerIndex < this.pongRoom.players.length &&
      loserIndex >= 0 &&
      loserIndex < this.pongRoom.players.length
    ) {
      this.pongRoom.players[winnerIndex].client.emit('winner');
      this.pongRoom.players[loserIndex].client.emit('loser');
    } else {
      console.error('Invalid player index');
    }
  }

  async declarePlayerWinnerForDeconnection(winnerIndex: number) {
    if (winnerIndex >= 0 && winnerIndex < this.pongRoom.players.length) {
      this.pongRoom.players[winnerIndex].client.emit('winner');
      if (winnerIndex === 0) this.gameState.score = [1, 0];
      else this.gameState.score = [0, 1];
      await this.endGame();
    } else {
      console.error('Invalid player index deconnection');
    }
  }

  declareDraw() {
    this.pongRoom.players.forEach((player) => player.client.emit('draw'));
  }

  moveDown(player: number) {
    if (player === 1) this.gameState.pongPaddle1.moveDown();
    else if (player === 0) this.gameState.pongPaddle2.moveDown();
    else throw new Error('moveDown player nb ' + JSON.stringify(player));
  }

  moveUp(player: number) {
    if (player === 1) this.gameState.pongPaddle1.moveUp();
    else if (player === 0) this.gameState.pongPaddle2.moveUp();
    else throw new Error('moveUp player nb ' + JSON.stringify(player));
  }

  stopMoving(player: number) {
    if (player === 1) this.gameState.pongPaddle1.stopMoving();
    else if (player === 0) this.gameState.pongPaddle2.stopMoving();
    else throw new Error('stopMoving player nb ' + JSON.stringify(player));
  }
}
