import { Game } from '../instance/game';
import { Player } from '../type';
import { BEFORE_GAME } from '../const';
import { PongGateway } from '../websocket/pong.gateway';
import { PlayerManager } from './playerManager';

export class PongRoom {
  //game
  pongGateway: PongGateway;
  static id: number = 0;
  game: Game = new Game(this);
  GameState: { score: [number, number] };
  started = false;
  isGameEnded: boolean = false;
  //pause
  startTime: number = 0;
  pauseTime: number = 0;
  totalPauseTime: number = 0;
  //players
  PlayerManager: PlayerManager = new PlayerManager(this);

  constructor(PongGateway: PongGateway) {
    this.pongGateway = PongGateway;
    this.GameState = { score: [0, 0] };
  }

  get players(): Player[] {
    return this.PlayerManager.players;
  }

  start() {
    if (!this.PlayerManager.isMaxPlayer()) return;
    console.log('Game started id:', Game.id);
    this.PlayerManager.showPlayers();
    this.started = true;
    setTimeout(() => this.game.start(), BEFORE_GAME);
  }

  end() {
    if (!this.started) return;
    console.log('Game ended');
    this.started = false;
    this.game.endGame();
  }

  pause() {
    console.log('Game paused');
    this.game.pause();
  }

  resume() {
    console.log('Game resumed');
    this.game.resume();
  }

  close() {
    this.pongGateway.closeRoom(this);
  }

  moveDown(player: number) {
    // console.log('moveDown', player);
    if (!this.started) return;
    this.game.moveDown(player);
  }

  moveUp(player: number) {
    // console.log('moveUp', player);
    if (!this.started) return;
    this.game.moveUp(player);
  }

  stopMoving(player: number) {
    // console.log('stopMoving', player);
    if (!this.started) return;
    this.game.stopMoving(player);
  }

  sendBallPosition(ball: Matter.Vector) {
    // console.log('Ball position sent to clients:', ball);
    this.players.forEach((player) => {
      player.client.emit('ball', ball);
    });
  }

  sendPaddlePosition(paddle: [number, number], playerNumber: number) {
    // console.log(`Paddle${playerNumber} position sent to clients:`, paddle);
    this.players.forEach((player) => {
      player.client.emit(`paddle${playerNumber}`, paddle);
    });
  }

  sendScore(score: [number, number]) {
    console.log('Score sent to clients:', score);
    this.players.forEach((player) => {
      player.client.emit('score', score);
    });
  }

  sendTime(time: number) {
    // console.log('Time sent to clients:', time);
    this.players.forEach((player) => {
      player.client.emit('time', Math.floor(time));
    });
  }

  sendGamePaused() {
    console.log('Game paused sent to clients');
    this.players.forEach((player) => {
      player.client.emit('pause');
    });
  }

  sendGameResumed() {
    console.log('Game resumed sent to clients');
    this.players.forEach((player) => {
      player.client.emit('resume');
    });
  }
}
