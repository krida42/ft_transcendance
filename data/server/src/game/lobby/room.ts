import { Socket  } from 'socket.io';
import { Game } from "../instance/game";
import { Player } from '../type';
import { BEFORE_GAME, TIMEOUT_RECONNECT } from '../const';
import { PongGateway } from '../websocket/pong.gateway';

export class PongRoom {
  pongGateway: PongGateway;
	game: Game;
  GameState: { score: [number, number]; time: number; };
	started = false;
  startTime: number = 0;
  pauseTime: number = 0;
  isGameEnded: boolean = false;
  playersMax = 2;
  players = new Array<Player>();
  disconnectPlayers = new Map<string, NodeJS.Timeout>();
  
  constructor(PongGateway: PongGateway) {
    this.game = new Game(this);
    this.pongGateway = PongGateway;
    this.GameState = { score: [0, 0], time: 0 };
  }

  showPlayers() {
    console.log('Players login in room', this.players.map(p => p.user.login));
  }

  timeGestion() {
    if (this.pauseTime !== 0) {
      this.startTime -= Date.now() - this.pauseTime;
      this.pauseTime = 0;
    }
  }

  start() {
    console.log('Game started id:', Game.id);
    this.showPlayers();
    if (this.started || this.players.length !== this.playersMax) {
      return;
    }
    this.started = true;
    setTimeout(() => this.game.start(), BEFORE_GAME);
  }

  end() {
    if (!this.started)
      return;
    console.log('Game ended');
    this.started = false;
    this.game.endGame();
  }

  close() {
    this.pongGateway.closeRoom(this);
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
    this.pauseTime = Date.now();
    this.game.pause();
	}

  reconnectPlayer(oldPlayer: Player, newPlayer: Player) {
    oldPlayer.client = newPlayer.client;
    oldPlayer.disconnected = false;
    clearTimeout(this.disconnectPlayers.get(oldPlayer.client.id));
    this.game.start();
    console.log(`Client reconnected: ${oldPlayer.user.login}`);

    oldPlayer.client.emit('gameState', this.GameState);
  
    // Reset paddle movement event handlers for the reconnected player
    oldPlayer.client.on('moveUp', () => this.moveUp(oldPlayer.number));
    oldPlayer.client.on('moveDown', () => this.moveDown(oldPlayer.number));
  }

  addPlayerToRoom(player: Player) {
    if (this.players.length < this.playersMax) {
      this.players.push(player);
      this.players[this.players.length - 1].number = this.players.length;
    }
    if (this.players.length === this.playersMax && this.started === false)
      this.start();
  }

  addPlayer(player: Player) {
    console.log('Player added to room', player.user.login);
    if (this.isGameEnded) {
      console.log('Game has ended. Player cannot join.');
      return;
    }
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
    this.game.pause();
    player.disconnected = true;
    console.log('Player removed from room');
    this.showPlayers();
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
        const otherPlayerIndex = this.players.findIndex(p => p !== player);
        if (otherPlayerIndex !== -1) {
          // Declare the other player as the winner
          this.game.declarePlayerWinnerForDeconnection(otherPlayerIndex);
          this.players.splice(index, 1);
          // this.end();
          // this.close();
        }
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