import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { SubscribeMessage } from '@nestjs/websockets';
import * as jwt from 'jsonwebtoken';
import { ResponseUserDto } from 'src/users/dto/responseUser.dto';
import { PongRoom } from '../lobby/room';
import { PlayerManager } from '../lobby/playerManager';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket'],
})
export class PongGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;
  rooms = new Array<PongRoom>();
  usersMap = new Map<string, Socket>();

  getUserWithCookie(socket: Socket): ResponseUserDto {
    let cookie = socket.handshake.headers.cookie;
    if (!cookie) {
      return;
    }
    cookie = cookie.split('=')[1];
    const user = jwt.decode(cookie) as ResponseUserDto;
    if (!user) {
      return null;
    }
    return user;
  }

  whichRoom(user: ResponseUserDto): PongRoom {
    return this.rooms.find((r) => r.PlayerManager.hasPlayer(user.public_id));
  }

  isConnected(userCookie: ResponseUserDto): boolean {
    const client = this.usersMap.get(userCookie.public_id);
    if (!client) return false;
    client.emit('alreadyConnected');
    this.whichRoom(userCookie).PlayerManager.addPlayer({
      user: userCookie,
      client,
    });
    return true;
  }

  handleConnection(client: Socket) {
    const userCookie = this.getUserWithCookie(client);
    if (!userCookie) return;

    const existingRoom = this.whichRoom(userCookie);
    if (existingRoom) {
      const existingPlayer = existingRoom.PlayerManager.players.find(
        (p) => p.user.public_id === userCookie.public_id,
      );
      if (existingPlayer && existingPlayer.disconnected) {
        existingRoom.PlayerManager.reconnectPlayer(existingPlayer, {
          user: userCookie,
          client,
        });
        return;
      }
    }

    if (!this.isConnected(userCookie)) {
      this.addUserToMap(userCookie, client);
      this.addUserToRoom(userCookie, client);
    }
  }

  handleDisconnect(client: Socket) {
    const userCookie = this.getUserWithCookie(client);
    if (userCookie) {
      const room = this.rooms.find((r) =>
        r.PlayerManager.hasPlayer(userCookie.public_id),
      );
      if (room) {
        room.PlayerManager.removePlayer(client);
        this.usersMap.delete(userCookie.public_id);
        console.log(`Client disconnected: ${userCookie.login}`);
      }
    }
  }

  addUserToMap(userCookie: ResponseUserDto, client: Socket) {
    const player = { user: userCookie, client };
    this.usersMap.set(userCookie.public_id, client);
  }

  addUserToRoom(userCookie: ResponseUserDto, client: Socket) {
    let room = this.findRoomForUser(userCookie);
    if (!room) {
      room = this.findOrCreateRoom();
    }
    room.PlayerManager.addPlayer({ user: userCookie, client });
  }

  findRoomForUser(userCookie: ResponseUserDto): PongRoom {
    return this.rooms.find((r) =>
      r.PlayerManager.hasPlayer(userCookie.public_id),
    );
  }

  findOrCreateRoom(): PongRoom {
    let room = this.rooms.find((r) => !r.PlayerManager.isFull());
    if (!room) {
      room = new PongRoom(this);
      this.rooms.push(room);
    }
    return room;
  }

  closeRoom(room: PongRoom) {
    const index = this.rooms.findIndex((r) => r === room);
    const players = room.players;
    players.forEach((player) => {
      player.client.emit('roomClosed');
      this.usersMap.delete(player.user.public_id);
    });
    if (index !== -1) {
      if (this.rooms[index].isGameEnded) this.rooms.splice(index, 1);
    }
  }

  @SubscribeMessage('moveUp')
  handleMoveUp(client: Socket) {
    const userCookie = this.getUserWithCookie(client);
    if (userCookie) {
      const room = this.rooms.find((r) =>
        r.PlayerManager.hasPlayer(userCookie.public_id),
      );
      if (room) {
        const player = room.players.find((p) => p.client.id === client.id);
        if (player) {
          room.moveUp(player.number);
        }
      }
    }
  }

  @SubscribeMessage('moveDown')
  handleMoveDown(client: Socket) {
    const userCookie = this.getUserWithCookie(client);
    if (userCookie) {
      const room = this.rooms.find((r) =>
        r.PlayerManager.hasPlayer(userCookie.public_id),
      );
      if (room) {
        const player = room.players.find((p) => p.client.id === client.id);
        if (player) {
          room.moveDown(player.number);
        }
      }
    }
  }

  @SubscribeMessage('stopMoving')
  handleStopMoving(client: Socket) {
    const userCookie = this.getUserWithCookie(client);
    if (userCookie) {
      const room = this.rooms.find((r) =>
        r.PlayerManager.hasPlayer(userCookie.public_id),
      );
      if (room) {
        const player = room.players.find((p) => p.client.id === client.id);
        if (player) {
          room.stopMoving(player.number);
        }
      }
    }
  }

  @SubscribeMessage('newGame')
  newGame() {
    console.log('new game');
  }
}
