import { Player } from '../type';
import { Socket } from 'socket.io';
import { PongRoom } from './room';
import { TIMEOUT_RECONNECT } from '../const';

export class PlayerManager {
  players = new Array<Player>();
  playersMax = 2;
  disconnectPlayers = new Map<string, NodeJS.Timeout>();
  pongRoom: PongRoom;

  constructor(pongRoom: PongRoom) {
    this.pongRoom = pongRoom;
  }

  addPlayer(player: Player) {
    if (!this.canAddPlayer(player)) return false;
    player.number = this.players.length;
    this.players.push(player);
    console.log(`Player ${player.user.login} added to room: ${PongRoom.id}`);
    this.showPlayers();
    this.pongRoom.start();
    return true;
  }

  isMaxPlayer() {
    return this.players.length === this.playersMax;
  }

  isAlreadyInRoom(player: Player) {
    return !!this.players.find(
      (p) => p.user.public_id === player.user.public_id,
    );
  }

  canAddPlayer(player: Player) {
    return (
      !this.isMaxPlayer() &&
      !this.isAlreadyInRoom(player) &&
      !this.pongRoom.started &&
      !this.pongRoom.isGameEnded &&
      !this.isPlayerInARoom(player)
    );
  }

  removePlayer(client: Socket) {
    const player = this.players.find((p) => p.client.id === client.id);
    if (!player) return;
    if (!this.pongRoom.started)
      this.players.splice(this.players.indexOf(player), 1);
    else {
      this.disconnectPlayer(player);
      this.removeDisconnectedPlayer(player, client);
    }
  }

  getPlayerIndex(client: Socket): number {
    return this.players.findIndex((p) => p.client.id === client.id);
  }

  endGameIfNoPlayers() {
    if (this.players.length === 0) {
      console.log('No more players in room');
      this.pongRoom.end();
    }
  }

  pauseGameIfNotEnoughPlayers() {
    if (this.disconnectPlayers.size >= 1) {
      console.log('Not enough players in room');
      this.pongRoom.started = false;
      this.pongRoom.pause();
    }
  }

  isFull(): boolean {
    return this.players.length === this.playersMax;
  }

  hasPlayer(public_id: string): boolean {
    return !!this.players.find((p) => p.user.public_id === public_id);
  }

  removeDisconnectedPlayer(player: Player, client: Socket) {
    this.disconnectPlayers.set(
      player.client.id,
      setTimeout(() => {
        const index = this.getPlayerIndex(client);
        console.log(`Client disconnected: ${player.user.login}`);
        this.players[index].disconnected = true;
        this.endGameIfNoPlayers();
        this.pauseGameIfNotEnoughPlayers();

        const otherPlayerIndex = this.players.findIndex((p) => p !== player);
        if (
          otherPlayerIndex !== -1 &&
          !this.players[otherPlayerIndex].disconnected
        ) {
          console.log('Other player won');
          this.pongRoom.game.declarePlayerWinnerForDeconnection(
            otherPlayerIndex,
          );
          this.players.splice(index, 1);
        } else if (
          otherPlayerIndex !== -1 &&
          this.players[otherPlayerIndex].disconnected
        ) {
          console.log('Double disconnection');
          this.pongRoom.game.declareAbandon();
        }
      }, TIMEOUT_RECONNECT),
    );
  }

  disconnectPlayer(player: Player) {
    this.pongRoom.pause();
    player.disconnected = true;
    console.log(
      `Player ${player.user.login} disconnected from room: ${PongRoom.id}`,
    );
  }

  reconnectPlayer(oldPlayer: Player, newPlayer: Player) {
    clearTimeout(this.disconnectPlayers.get(oldPlayer.client.id));
    this.disconnectPlayers.delete(oldPlayer.client.id);
    oldPlayer.client = newPlayer.client;
    oldPlayer.disconnected = false;
    console.log(`Client reconnected: ${oldPlayer.user.login}`);

    oldPlayer.client.emit('gameState', this.pongRoom.GameState);

    oldPlayer.client.on('moveUp', () => {
      if (oldPlayer.number != 0 && oldPlayer.number != 1)
        throw new Error('reconnectPlayer move up' + oldPlayer.number);
      this.pongRoom.moveUp(oldPlayer.number);
    });

    oldPlayer.client.on('moveDown', () => {
      if (oldPlayer.number != 0 && oldPlayer.number != 1)
        throw new Error('reconnectPlayer move down' + oldPlayer.number);
      this.pongRoom.moveDown(oldPlayer.number);
    });

    if (this.pongRoom.started && !this.pongRoom.isGameEnded) {
      this.pongRoom.resume();
    } else if (this.players.length === this.playersMax) {
      this.pongRoom.start();
    }
  }

  isPlayerInARoom(player: Player): boolean {
    return !!this.pongRoom.pongGateway.rooms.find((r) =>
      r.PlayerManager.hasPlayer(player.user.public_id),
    );
  }

  showPlayers() {
    console.log(
      `Players login in room:${PongRoom.id} `,
      this.players.map((p) => p.user.login),
    );
  }
}
