import { Socket  } from 'socket.io';
import { Game } from "../instance/game";
import { Player } from '../type';
import { TIMEOUT_RECONNECT, TIME_END_GAME } from '../const';

export class PongRoom {
	game: Game;
	started = false;
  playersMax = 2;
  players = new Array<Player>();
  timerGame: NodeJS.Timeout;
  disconnectPlayers = new Map<string, NodeJS.Timeout>();
  
  constructor() {
    this.game = new Game(this);
  }
  
  timerStartGame() {
    this.timerGame = setTimeout(() => {
      this.end();
    }, TIME_END_GAME);
    
  }

  showPlayers() {
    console.log('Players login in room', this.players.map(p => p.user.login));
  }

	start() {
		console.log('Game started id:', this.game.id);
    this.showPlayers();
    if (!this.started && this.players.length === this.playersMax) {
      this.started = true;
      this.game.start();
      // this.timerStartGame(); // temps de jeu
    }
	}

  end() {
    if (!this.started)
      return;
    console.log('Game ended');
    this.started = false;
    this.game.end();
    clearTimeout(this.timerGame);
    this.players.forEach(player => {
      player.client.emit('end');
    });
  }

  moveDown(player: number) {
    console.log('moveDown', player);
    if (!this.started)
      return;
    this.game.moveDown(player);
  }

  moveUp(player: number) {
    console.log('moveUp', player);
    if (!this.started)
      return;
    this.game.moveUp(player);
  }

  sendBallPosition(ball: [number, number]) {
    // console.log('Ball position sent to clients:', ball); 
    this.players.forEach(player => {
      player.client.emit('ball', ball);
    });
  }

  sendPaddlePosition(paddle: [number, number], playerNumber: number) {
    // console.log(`Paddle${playerNumber} position sent to clients:`, paddle);
    this.players.forEach(player => {
      player.client.emit(`paddle${playerNumber}`, paddle);
    });
  }

  sendScore(score: [number, number]) {
    console.log('Score sent to clients:', score);
    this.players.forEach(player => {
      player.client.emit('score', score);
    });
  }

  sendTime(time: number) {
    // console.log('Time sent to clients:', time);
    this.players.forEach(player => {
      player.client.emit('time', Math.floor(time));
    });
  }
	
	pause() {
		console.log('Game paused');
		this.game.pause();
	}

  reconnectPlayer(oldPlayer: Player, newPlayer: Player) {
    oldPlayer.client = newPlayer.client;
    oldPlayer.disconnected = false;
    clearTimeout(this.disconnectPlayers.get(oldPlayer.client.id));
    this.game.start();
    console.log(`Client reconnected: ${oldPlayer.user.login}`);
  }

  addPlayerToRoom(player: Player) {
    if (this.players.length < this.playersMax) {
      this.players.push(player);
      this.players[this.players.length - 1].number = this.players.length;
    }
    if (this.players.length === this.playersMax && this.started === false)
      this.start();
    console.log('Player added to room', player.user.login);
  }

  addPlayer(player: Player) {
    console.log('Player added to room', player.user.login);
    const oldPlayer = this.players.find(p => p.user.public_id === player.user.public_id);
    if (oldPlayer)
      this.reconnectPlayer(oldPlayer, player);
    else
      this.addPlayerToRoom(player);
  }

  removePlayer(client: Socket) {
    const player = this.players.find(p => p.client.id === client.id);
    if (!player)
      return;
    this.disconnectPlayer(player);
    this.removeDisconnectedPlayer(player, client);
  }
  
  disconnectPlayer(player: Player) {
    player.disconnected = true;
    console.log('Player removed from room');
    this.showPlayers();
    this.game.pause();
  }
  
  removeDisconnectedPlayer(player: Player, client: Socket) {
    this.disconnectPlayers.set(
      player.client.id,
      setTimeout(() => {
        const index = this.players.findIndex(p => p.client.id === client.id);
        if (index !== -1) {
          this.players.splice(index, 1);
        }
        if (this.players.length === 0) {
          this.end();
        }
        else if (this.players.length < this.playersMax) {
          this.started = false;
          this.game.pause();
        }
      }, TIMEOUT_RECONNECT));
  }

  isFull(): boolean {
    return this.players.length === this.playersMax;
  }

  hasPlayer(public_id: string): boolean {
    return !!this.players.find(p => p.user.public_id === public_id);
  }
}