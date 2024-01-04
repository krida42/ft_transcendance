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

  async addPlayer(player: Player): Promise<boolean | undefined> {
    try {
      if (!this.canAddPlayer(player)) {
        console.log('Player cannot be added', player.user.login);
        return false;
      }
      player.number = this.players.length;

      this.players.push(player);

      console.log(`Player ${player.user.login} added to room: ${PongRoom.id}`);
      this.showPlayers();

      await this.pongRoom.start();
      return true;
    } catch (error) {
      console.error('Error adding player:', error);
    }
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
      !this.pongRoom.pongGateway.whichRoomForClient(player.client)
    );
  }

  async removePlayer(client: Socket) {
    try {
      const player = this.players.find((p) => p.client.id === client.id);
      if (!player) return;
      if (!this.pongRoom.started)
        this.players.splice(this.players.indexOf(player), 1);
      else {
        await this.disconnectPlayer(player);
        await this.removeDisconnectedPlayer(player, client);
      }
    } catch (error) {
      console.error('Error removing player:', error);
    }
  }

  getPlayerIndex(client: Socket): number {
    return this.players.findIndex((p) => p.client.id === client.id);
  }

  async endGameIfNoPlayers() {
    try {
      if (this.players.length === 0) {
        console.log('No more players in room');
        await this.pongRoom.game.endGame();
      }
    } catch (error) {
      console.error('Error ending game:', error);
    }
  }

  pauseGameIfNotEnoughPlayers() {
    try {
      if (this.disconnectPlayers.size >= 1) {
        console.log('Not enough players in room');
        this.pongRoom.started = false;
        this.pongRoom.pause();
      }
    } catch (error) {
      console.error('Error pausing game:', error);
    }
  }

  isFull(): boolean {
    return this.players.length === this.playersMax;
  }

  hasPlayer(public_id: string): boolean {
    return !!this.players.find((p) => p.user.public_id === public_id);
  }

  async removeDisconnectedPlayer(player: Player, client: Socket) {
    try {
        const timeout = setTimeout(async () => {
        if (!this.disconnectPlayers.has(player.client.id)) {
          return; // Sortie de la fonction si le timeout a été annulé
        }

        const index = this.getPlayerIndex(client);
        console.log(`Client disconnected: ${player.user.login}`);
        this.players[index].disconnected = true;
        // await this.endGameIfNoPlayers();
        // this.pauseGameIfNotEnoughPlayers();

        const otherPlayerIndex = this.players.findIndex((p) => p !== player);
        if (
          otherPlayerIndex !== -1 &&
          !this.players[otherPlayerIndex].disconnected
        ) {
          // console.log('Other player won');
          await this.pongRoom.game.declarePlayerWinnerForDeconnection(
            otherPlayerIndex,
          );
          this.players.splice(index, 1);
        }
      }, TIMEOUT_RECONNECT);

      this.disconnectPlayers.set(player.client.id, timeout);
      if (this.isAllPlayersDisconnected()) {
        // console.log('All players disconnected');
        await this.pongRoom.game.endGame();
      }
    } catch (error) {
      console.error('Error removing disconnected player:', error);
    }
  }

  async disconnectPlayer(player: Player) {
    console.log('PlayerManager disconnectPlayer');
    try {
      this.pongRoom.pause();
      player.disconnected = true;
      console.log(
        `Player ${player.user.login} disconnected from room: ${PongRoom.id}`,
      );
      if (this.isAllPlayersDisconnected()) {
        // console.log('All players disconnected');
        await this.pongRoom.game.endGame();
      }
    } catch (error) {
      console.error('Error disconnecting player:', error);
    }
  }

  async reconnectPlayer(oldPlayer: Player, newPlayer: Player) {
    console.log('PlayerManager reconnectPlayer');
    try {
      clearTimeout(this.disconnectPlayers.get(oldPlayer.client.id));
      this.disconnectPlayers.delete(oldPlayer.client.id);
      oldPlayer.client = newPlayer.client;
      oldPlayer.disconnected = false;
      console.log(`Client reconnected: ${oldPlayer.user.login}`);

      await this.pongRoom.game.resume();
    } catch (error) {
      console.error('Error reconnecting player:', error);
    }
  }

  isAllPlayersDisconnected(): boolean {
    return this.players.every((p) => p.disconnected);
  }

  showPlayers() {
    console.log(
      `Players in room ${PongRoom.id}:`,
      this.players.map((p) => p.user.login),
    );
  }
}
