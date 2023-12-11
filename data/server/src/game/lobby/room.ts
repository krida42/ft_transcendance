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
    setTimeout(async() => {
      try {
        await this.game.start();
      } catch (err) {
        console.log(err);
      }
    }, BEFORE_GAME);
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
    try {
      await GameDBManager.saveGame(gameSave);
    } catch (err) {
      console.log(err);
    }
  }

  pause() {
    console.log('Game paused');
    try {
      this.game.pause();
    } catch (err) {
      console.log(err);
    }
  }

  resume() {
    console.log('Game resumed');
    try {
      this.game.resume();
    } catch (err) {
      console.log(err);
    }
  }

  async close() {
    try {
      await this.save();
      this.pongGateway.closeRoom(this);
    } catch (err) {
      console.log(err);
    }
  }

  async closeWithAchievement() {
    try {
      await this.close();
      const user1 = await User.findOne({ where: { public_id: this.players[0].user.public_id } });
      const achievement = new Achievement();
      if (user1)
        await achievement.checkAchievements(user1);
      const user2 = await User.findOne({ where: { public_id: this.players[1].user.public_id } });
      if (user2)
        await achievement.checkAchievements(user2);
      await achievement.checkManHunter(user1, user2);
    } catch (err) {
      console.log(err);
    }
  }

  closeWithoutSave() {
    this.pongGateway.closeRoom(this);
  }

  moveDown(player: number) {
    // console.log('moveDown', player);
    if (!this.started) return;
    try {
      this.game.moveDown(player);
    } catch (err) {
      console.log(err);
    }
  }

  moveUp(player: number) {
    // console.log('moveUp', player);
    if (!this.started) return;
    try {
      this.game.moveUp(player);
    } catch (err) {
      console.log(err);
    }
  }

  stopMoving(player: number) {
    // console.log('stopMoving', player);
    if (!this.started) return;
    try {
      this.game.stopMoving(player);
    } catch (err) {
      console.log(err);
    }
  }

  sendBallPosition(ball: Matter.Vector) {
    // console.log('Ball position sent to clients:', ball);
    try {
      this.players.forEach((player) => {
        player.client.emit('ball', ball);
      });
    } catch (err) {
      console.log(err);
    }
  }

  sendPaddlePosition(paddle: [number, number], playerNumber: number) {
    // console.log(`Paddle${playerNumber} position sent to clients:`, paddle);
    try {
      this.players.forEach((player) => {
        player.client.emit(`paddle${playerNumber}`, paddle);
      });
    } catch (err) {
      console.log(err);
    }
  }

  sendScore(score: [number, number]) {
    console.log('Score sent to clients:', score);
    try {
      this.players.forEach((player) => {
        player.client.emit('score', score);
      });
    } catch (err) {
      console.log(err);
    }
  }

  sendTime(time: number) {
    // console.log('Time sent to clients:', time);
    try {
      this.players.forEach((player) => {
        player.client.emit('time', Math.floor(time));
      });
    } catch (err) {
      console.log(err);
    }
  }

  sendGamePaused() {
    console.log('Game paused sent to clients');
    try {
      this.players.forEach((player) => {
        player.client.emit('pause');
      });
    } catch (err) {
      console.log(err);
    }
  }

  sendGameResumed() {
    console.log('Game resumed sent to clients');
    try {
      this.players.forEach((player) => {
        player.client.emit('resume');
      });
    } catch (err) {
      console.log(err);
    }
  }
}