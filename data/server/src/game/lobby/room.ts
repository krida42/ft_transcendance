import { Game } from '../instance/game';
import { Player } from '../type';
import { BEFORE_GAME } from '../const';
import { PongGateway } from '../websocket/pong.gateway';
import { PlayerManager } from './playerManager';
import { GameDBManager } from '../database/db';
import { GameSave } from '../type';
import { Achievement } from '../achievements/achievements';
import { User } from 'db/models/user';

export class PongRoom {
  //game
  pongGateway: PongGateway;
  static id: number = 0;

  game: Game = new Game(this);
  started = false;
  isGameEnded: boolean = false;
  //pause
  startTime: number = 0;
  pauseTime: number = 0;
  totalPauseTime: number = 0;
  //players
  PlayerManager: PlayerManager = new PlayerManager(this);
  //save
  gameSaved:boolean = false;
  
  constructor(PongGateway: PongGateway) {
    this.pongGateway = PongGateway;
  }

  get players(): Player[] {
    return this.PlayerManager.players;
  }

  async start() {
    if (!this.PlayerManager.isMaxPlayer()) return;
    console.log('Game started id:', Game.id);
    this.PlayerManager.showPlayers();
    this.started = true;
    setTimeout(async() => await this.game.start(), BEFORE_GAME);
  }

  async save() {
    if (this.gameSaved) return;
    console.log('Game saved', "score1:", this.game.gameState.score[0], "score2:", this.game.gameState.score[1]);
    const gameSave: GameSave = {
      player1_id: this.players[0].user.public_id,
      player2_id: this.players[1].user.public_id,
      score1: this.game.gameState.score[0],
      score2: this.game.gameState.score[1],
      time: this.game.timeAtEnd,
    };
    this.gameSaved = true;
    await GameDBManager.saveGame(gameSave);
  }

  pause() {
    console.log('Game paused');
    this.game.pause();
  }

  resume() {
    console.log('Game resumed');
    this.game.resume();
  }

  async close() {
    await this.save();
    this.pongGateway.closeRoom(this);
  }

  async closeWithAchievement() {
    await this.close();
    const user1 = await User.findOne({ where: { public_id: this.players[0].user.public_id } });
    const achievement = new Achievement();
    if (user1)
      await achievement.checkAchievements(user1);
    const user2 = await User.findOne({ where: { public_id: this.players[1].user.public_id } });
    if (user2)
      await achievement.checkAchievements(user2);
    await achievement.checkManHunter(user1, user2);
  }

  closeWithoutSave() {
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
