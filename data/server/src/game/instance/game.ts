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

  //test 
  idRoom: number = 0;
  constructor(PongRoom: PongRoom) {
    Game.id++;
    this.pongRoom = PongRoom;
    // // console.log('PongRoom mode:', PongRoom.mode);
    // // console.log('Game key:', PongRoom?.key);
    this.gameState = GameInit.initGameState(this.pongRoom.mode);
    this.setupScoreEvent();
  }

  async setupTimeEndGame(timeEndGame: number = TIME_END_GAME) {

    // // console.log('setupTimeEndGame timeEndGame DECLAREWINNER', timeEndGame);


    const date = new Date();
    // console.log(" \n DAte.now \n", date);
    this.timeEndGame = setTimeout(async () => {
      this.running = false;
      // console.log("\n Date.next \n", date);
      // // console.log('setupTimeEndGame gameState.score', this.gameState.score);
      // // console.log('setupTimeEndGame timeEndGame DECLAREWINNER', timeEndGame);
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
    // console.log('game pause')
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
    // console.log('game resume')
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
    // console.log('game end');
    this.finished = true;
    this.clearIntervals();
    this.gameState.pongWorld.end();
  }

  async endGame() {
    clearTimeout(this.timeEndGame);
    // console.log('game endGame');
    this.pongRoom.isGameEnded = true;
    this.running = false;
    if (this.pongRoom.PlayerManager.isAllPlayersDisconnected()) {
      // console.log('WITHOUT SAVE');
      this.pongRoom.closeWithoutSave();
    } else if (this.pongRoom.PlayerManager.disconnectPlayers.size > 0)
      await this.pongRoom.close();
    else await this.pongRoom.closeWithAchievement();
    this.end();
  }

  resetPositions() {
    // // console.log('game resetPositions');
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

  async updateScore(event: any) {
    try {
       if (event.player === 1) this.gameState.score[0]++;
       else if (event.player === 2) this.gameState.score[1]++;
       else throw new Error('Invalid player number');
 
       const score: [number, number] = this.gameState.score;
      //  // console.log('game updateScore', score);
      //  // console.log('game updateScoreGAMSTATE', this.gameState.score);
       this.pongRoom.sendScore(this.gameState.score);
 
       if (score[0] >= SCORE_TO_WIN || score[1] >= SCORE_TO_WIN) {
          // console.log("UPthis.scorePlayer1", score[0], "this.scorePlayer2", score[1]);
          // console.log("UPthis.gameState.score", this.gameState.score);
          await this.declareWinner();
       }
    } catch (err) {
       console.error("Declare Winner:", err);
    }
 }
 
  setupIntervals() {
    this.gameInterval = setInterval(() => this.sendStatusGameClient(), 10);
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
    this.pongRoom.sendScore(this.gameState.score);
    this.pongRoom.sendMode(this.pongRoom.mode);
    // // console.log('time', time);
  }

  sendGamePaused() {
    // console.log('game sendGamePaused');
    this.pongRoom.sendGamePaused();
  }

  sendGameResumed() {
    // console.log('game sendGameResumed');
    this.pongRoom.sendGameResumed();
  }

  async declareWinner() {
    // console.log('game declareWinner', "gameState.score", this.gameState.score);
    if (this.gameState.score[0] > this.gameState.score[1]) this.declarePlayerWinner(0, 1);
    else if (this.gameState.score[1] > this.gameState.score[0])
      this.declarePlayerWinner(1, 0);
    else this.declareDraw();
    await this.endGame();
  }

  declarePlayerWinner(winnerIndex: number, loserIndex: number) {
    // console.log('game declarePlayerWinner');
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
    // console.log('game declarePlayerWinnerForDeconnection');
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
    // console.log('game declareDraw');
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
