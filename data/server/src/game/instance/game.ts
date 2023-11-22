import { SCORE_TO_WIN, TIME_END_GAME } from '../const';
import { PongRoom } from '../lobby/room';
import { GameState } from "../type";
import { GameInit } from "./gameInit";
import * as Matter from 'matter-js';

export class Game {
  static id: number = 0;
  finished: boolean = false;
  lastTime: number = 0;
  scorePlayer1: number = 0;
  scorePlayer2: number = 0;

  pongRoom: PongRoom;
  gameState: GameState;
  gameEnded = false;

  gameInterval: NodeJS.Timeout;
  timeInterval: NodeJS.Timeout;
  displayInterval: NodeJS.Timeout;

  constructor(PongRoom: PongRoom) {
    Game.id++;
    this.pongRoom = PongRoom;
    this.gameState = GameInit.initGameState();
    this.setupScoreEvent();
  }

  // Setup score event
   setupScoreEvent() {
    Matter.Events.on(this.gameState.pongWorld.engine, 'score', (event) => {
      this.updateScore(event);
      this.resetPositions();
    });
  }

  // Update score based on event
  updateScore(event) {
    if (event.player === 1)
      this.scorePlayer1++;
    else if (event.player === 2)
      this.scorePlayer2++;
    const score: [number, number] = [this.scorePlayer1, this.scorePlayer2];
    this.pongRoom.sendScore(score);
    this.pongRoom.GameState.score = score;
  
    // Check if the game should end
    if (this.scorePlayer1 >= SCORE_TO_WIN || this.scorePlayer2 >= SCORE_TO_WIN) {
      this.endGame();
    }
  }

  // Start the game
  start() {
    this.gameState.pongWorld.run();
    if (this.pongRoom.startTime === 0)
      this.pongRoom.startTime = Date.now();
    this.pongRoom.timeGestion();
    this.setupIntervals();
    setTimeout(() => {
      this.declareWinner();
      this.endGame();
    }, TIME_END_GAME);
  }

  // Setup game and time intervals
  setupIntervals() {
    this.gameInterval = setInterval(() => this.sendStatusGameClient(), 1);
    this.timeInterval = setInterval(() => this.sendTimeGame(), 100);
  }

  // Send game status to client
  sendStatusGameClient() {
    const ball = this.gameState.pongBall.ball.position;
    if (this.gameState.pongWorld.engine.timing.timestamp - this.lastTime >= 1) {
      this.sendPositions(ball);
      this.lastTime = this.gameState.pongWorld.engine.timing.timestamp;
    }
  }

  // Send positions of ball and paddles
  sendPositions(ball) {
    this.pongRoom.sendBallPosition(ball);
    this.pongRoom.sendPaddlePosition([this.gameState.pongPaddle1.paddle.position.x,
      this.gameState.pongPaddle1.paddle.position.y], 1);
    this.pongRoom.sendPaddlePosition([this.gameState.pongPaddle2.paddle.position.x,
      this.gameState.pongPaddle2.paddle.position.y], 2);
  }

   // Declare the winner of the game
   declareWinner() {
    if (this.scorePlayer1 > this.scorePlayer2)
      this.declarePlayerWinner(0, 1);
    else if (this.scorePlayer2 > this.scorePlayer1)
      this.declarePlayerWinner(1, 0);
    else
      this.declareDraw();
    this.endGame();
  }

  // Declare a player as the winner
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
      this.pongRoom.players[winnerIndex].client.emit('winner');
    else {
      console.error('Invalid player index');
    }
  }

  // Declare the game as a draw
  declareDraw() {
    this.pongRoom.players.forEach(player => player.client.emit('draw'));
  }

  // End the game
  endGame() {
    if (this.gameEnded)
      return;
    this.pongRoom.isGameEnded = true;
    this.pongRoom.close();
    this.gameEnded = true;
    this.end();
  }

  // Reset the positions of the ball and paddles
  resetPositions() {
    this.gameState.pongBall.resetPosition();
    this.gameState.pongPaddle1.resetPosition();
    this.gameState.pongPaddle2.resetPosition();
  }

  // Send the game time to the client
  sendTimeGame() {
    const currentTime = Date.now();
    const elapsedTime = (currentTime - this.pongRoom.startTime) / 1000; // time in seconds
    this.pongRoom.sendTime(elapsedTime);
    console.log('Time sent to clients: time', this.pongRoom.GameState.time);
    this.pongRoom.GameState.time = elapsedTime;
  }

  // Move a player's paddle down
  moveDown(player: number) {
    if (player === 1)
      this.gameState.pongPaddle1.moveDown();
    else
      this.gameState.pongPaddle2.moveDown();
  }

  // Move a player's paddle up
  moveUp(player: number) {
    if (player === 1)
      this.gameState.pongPaddle1.moveUp();
    else
      this.gameState.pongPaddle2.moveUp();
  }

  // End the game and clear intervals
  end() {
    this.finished = true;
    this.clearIntervals();
  }

  // Clear all intervals
  clearIntervals() {
    clearInterval(this.gameInterval);
    clearInterval(this.timeInterval);
    clearInterval(this.displayInterval);
  }

  // Pause the game and clear intervals
  pause() {
    if (this.gameState.pongWorld.engine.timing.isRunning) {
      this.gameState.pongWorld.pause();
      this.clearIntervals();
    }
  }
}