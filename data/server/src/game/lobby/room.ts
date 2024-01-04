import { Game } from '../instance/game';
import { Options, Player } from '../type';
import { BEFORE_GAME } from '../const';
import { PongGateway } from '../websocket/pong.gateway';
import { PlayerManager } from './playerManager';
import { GameDBManager } from '../database/db';
import { GameSave } from '../type';
import { Achievement } from '../achievements/achievements';
import { User } from 'db/models/user';
import { v4 } from 'uuid';
import { uuidv4 } from 'src/types';
export class PongRoom {
  //game
  pongGateway: PongGateway;
  static id: number = 0;

  started = false;
  isGameEnded: boolean = false;
  mode: boolean = false;
  game: Game;
  //pause
  startTime: number = 0;
  pauseTime: number = 0;
  totalPauseTime: number = 0;
  //players
  PlayerManager: PlayerManager = new PlayerManager(this);
  //save
  gameSaved: boolean = false;
  //private
  key: uuidv4 = null;

  constructor(PongGateway: PongGateway, options?: Options) {
    PongRoom.id++;
    this.pongGateway = PongGateway;
    if (options?.uuid) {
      this.key = v4();
    }
    if (options?.mode) {
      this.mode = options.mode;
    }
    this.game = new Game(this);
  }

  get players(): Player[] {
    return this.PlayerManager.players;
  }

  async start() {
    if (!this.PlayerManager.isMaxPlayer())
    {
      // this.sendWaiting(true);
      return;
    }
    // this.sendWaiting(false);
    console.log('Game started id:', Game.id);
    this.started = true;
    setTimeout(async () => {
      try {
        await this.game.start();
      }catch (err){
          console.error(err);
      }
    }, BEFORE_GAME);
  }

  async save() {
    if (this.gameSaved) return;
    console.log(
      'Game saved',
      'score1:',
      this.game.gameState.score[0],
      'score2:',
      this.game.gameState.score[1],
    );
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
      console.error(err);
    }
  }

  pause() {
    console.log('Game paused');
    try {
      this.game.pause();
    } catch (err) {
      console.error(err);
    }
  }

  async resume() {
    console.log('Game resumed');
    try {
      await this.game.resume();
    } catch (err) {
      console.error(err);
    }
  }

  async close() {
    console.log('Game closed');
    try {
      console.log('Game closed');
      await this.save();
      this.pongGateway.closeRoom(this);
    } catch (err) {
      console.error(err);
    }
  }

  async closeWithAchievement() {
    console.log('Game closed with achievement');
    try {
      console.log('Game closed with achievement');
      await this.close();
      const user1 = await User.findOne({
        where: { public_id: this.players[0].user.public_id },
      });
      const achievement = new Achievement();
      if (user1) await achievement.checkAchievements(user1);
      const user2 = await User.findOne({
        where: { public_id: this.players[1].user.public_id },
      });
      if (user2) await achievement.checkAchievements(user2);
    } catch (err) {
      console.error(err);
    }
  }

  closeWithoutSave() {
    console.log('Game closed without save');
    this.pongGateway.closeRoom(this);
  }

  moveDown(player: number) {
    // console.log('moveDown', player);
    if (!this.started) return;
    try {
      this.game.moveDown(player);
    } catch (err) {
      console.error(err);
    }
  }

  moveUp(player: number) {
    // console.log('moveUp', player);
    if (!this.started) return;
    try {
      this.game.moveUp(player);
    } catch (err) {
      console.error(err);
    }
  }

  stopMoving(player: number) {
    // console.log('stopMoving', player);
    if (!this.started) return;
    try {
      this.game.stopMoving(player);
    } catch (err) {
      console.error(err);
    }
  }

  sendBallPosition(ball: Matter.Vector) {
    // console.log('Ball position sent to clients:', ball);
    try {
      this.players.forEach((player) => {
        player.client.emit('ball', ball);
      });
    } catch (err) {
      console.error(err);
    }
  }

  sendPaddlePosition(paddle: [number, number], playerNumber: number) {
    // console.log(`Paddle${playerNumber} position sent to clients:`, paddle);
    try {
      this.players.forEach((player) => {
        player.client.emit(`paddle${playerNumber}`, paddle);
      });
    } catch (err) {
      console.error(err);
    }
  }

  sendScore(score: [number, number]) {
    try {
      this.players.forEach((player) => {
        player.client.emit('score', score);
      });
    } catch (err) {
      console.error(err);
    }
  }

  sendTime(time: number) {
    // console.log('Time sent to clients:', time);
    try {
      this.players.forEach((player) => {
        player.client.emit('time', time);
      });
    } catch (err) {
      console.error(err);
    }
  }

  sendMode(mode: boolean) {
    // console.log('Mode sent to clients:', mode);
    try {
      this.players.forEach((player) => {
        player.client.emit('mode', mode);
      });
    } catch (err) {
      console.error(err);
    }
  }

  // sendWaiting(isWaiting: boolean) {
  //   console.log('Waiting sent to clients', isWaiting);
  //   try {
  //     if (isWaiting) {
  //       this.players.forEach((player) => {
  //         player.client.emit('waiting', true);
  //       });
  //     }
  //     else {
  //       this.players.forEach((player) => {
  //         player.client.emit('waiting', false);
  //       });
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }

  sendGamePaused() {
    console.log('Game paused sent to clients');
    try {
      this.players.forEach((player) => {
        player.client.emit('pause');
      });
    } catch (err) {
      console.error(err);
    }
  }

  sendGameResumed() {
    console.log('Game resumed sent to clients');
    try {
      this.players.forEach((player) => {
        player.client.emit('resume');
      });
    } catch (err) {
      console.error(err);
    }
  }
}
