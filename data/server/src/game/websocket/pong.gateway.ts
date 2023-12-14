import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { SubscribeMessage } from '@nestjs/websockets';
import * as jwt from 'jsonwebtoken';
import { ResponseUserDto } from 'src/users/dto/responseUser.dto';
import { PongRoom } from '../lobby/room';
import { Options } from '../type';

@WebSocketGateway({
  cors: {
    origin: `${process.env.VUE_APP_CUICUI}:8080`,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  namespace: 'game',
})
export class PongGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;
  rooms = new Array<PongRoom>();
  usersMap = new Map<string, Socket>();

  getUserWithCookie(socket: Socket): ResponseUserDto | null {
    try {
      let cookie = socket.handshake.headers.cookie;
      if (!cookie) {
        return null;
      }
      cookie = cookie.split('=')[1];
      const user = jwt.decode(cookie) as ResponseUserDto;
      if (!user) {
        return null;
      }
      return user;
    } catch (error) {
      console.error('Error while getting user with cookie:', error);
      return null;
    }
  }

  whichRoom(userCookie: ResponseUserDto): PongRoom | undefined {
    try {
      return this.rooms.find((r) =>
        r.PlayerManager.hasPlayer(userCookie.public_id),
      );
    } catch (error) {
      console.error('Error while finding room for user:', error);
    }
  }

  whichRoomForClient(client: Socket): PongRoom | undefined {
    try {
      const userCookie = this.getUserWithCookie(client);
      if (!userCookie) return;
      return this.whichRoom(userCookie);
    } catch (error) {
      console.error('Error while finding room for client:', error);
    }
  }

  async isConnected(userCookie: ResponseUserDto) {
    try {
      const client = this.usersMap.get(userCookie.public_id);
      if (!client) return false;

      const room = this.whichRoom(userCookie);
      if (room) {
        const player = room.PlayerManager.players.find(
          (p) => p.user.public_id === userCookie.public_id,
        );
        if (player) {
          player.disconnected = false;
          player.client = client;
        } else client.emit('alreadyConnected');
      }
    } catch (error) {
      console.error('Error while checking connection:', error);
      return false;
    }
  }

  async handleConnection(client: Socket) {
  }

  async handleDisconnect(client: Socket) {
    try {
      const userCookie = this.getUserWithCookie(client);
      if (userCookie) {
        const room: PongRoom | undefined = this.rooms.find((r) =>
          r.PlayerManager.hasPlayer(userCookie.public_id),
        );
        if (room) {
          await room.PlayerManager.removePlayer(client);
          this.usersMap.delete(userCookie.public_id);
          // console.log(`Client disconnected: ${userCookie.login}`);
        }
      }
    } catch (error) {
      console.error('Error while handling disconnection:', error);
    }
  }

  addUserToMap(userCookie: ResponseUserDto, client: Socket) {
    try {
      const player = { user: userCookie, client };
      this.usersMap.set(userCookie.public_id, client);
    } catch (error) {
      console.error('Error while adding user to map:', error);
    }
  }

  roomNotFull(): PongRoom | undefined {
    try {
      return this.rooms.find((r) => !r.PlayerManager.isFull() && !r.started);
    } catch (error) {
      console.error('Error while finding random room:', error);
    }
  }

  findOrCreateRoom(options?: Options): PongRoom | undefined {
    try {
      let room = this.roomNotFull();
      // console.log("Find a room", room?.players.length);
      if (!room || room.started) {
        // console.log("CREATE ROOM");
        room = new PongRoom(this, options);
        this.rooms.push(room);
      }
      return room;
    } catch (error) {
      console.error('Error while finding or creating room:', error);
    }
  }

  createRoom(options?: Options): PongRoom | undefined {
    try {
      const room = new PongRoom(this, options);
      this.rooms.push(room);
      return room;
    } catch (error) {
      console.error('Error while creating room:', error);
    }
  }

  closeRoom(room: PongRoom) {
    try {
      const index = this.rooms.findIndex((r) => r === room);
      const players = room.players;
      players.forEach((player) => {
        player.client.emit('roomClosed');
        this.usersMap.delete(player.user.public_id);
      });
      if (index !== -1) {
        if (this.rooms[index].isGameEnded) this.rooms.splice(index, 1);
      }
    } catch (error) {
      console.error('Error while closing room:', error);
    }
  }

  executeMove(client: Socket, moveDir: 'moveUp' | 'moveDown') {
    try {
      const userCookie = this.getUserWithCookie(client);
      if (!userCookie) return;
      const room = this.whichRoom(userCookie);
      if (!room) return;

      const player = room.players.find((p) => p.client.id === client.id);
      // console.log("PLAYER", player?.number);
      // console.log("ROOM", room.players);
      // console.log("CLIENT", client.id);
      if (player?.number == null || ![0, 1].includes(player?.number))
        throw new Error('Error MOVING' + player?.number);

      if (moveDir === 'moveUp') {
        room.moveUp(player.number);
      } else if (moveDir === 'moveDown') {
        room.moveDown(player.number);
      }
    } catch (error) {
      console.error('Error while executing move:', error);
    }
  }

  @SubscribeMessage('moveUp')
  handleMoveUp(client: Socket, data: any) {
    try {
      this.executeMove(client, 'moveUp');
    } catch (error) {
      console.error('Error while handling move up:', error);
    }
  }

  @SubscribeMessage('moveDown')
  handleMoveDown(client: Socket) {
    try {
      this.executeMove(client, 'moveDown');
    } catch (error) {
      console.error('Error while handling move down:', error);
    }
  }

  @SubscribeMessage('stopMoving')
  handleStopMoving(client: Socket) {
    try {
      const userCookie = this.getUserWithCookie(client);
      if (userCookie) {
        const room = this.rooms.find((r) =>
          r.PlayerManager.hasPlayer(userCookie.public_id),
        );
        if (room) {
          const player = room.players.find((p) => p.client.id === client.id);
          if (player?.number == null || ![0, 1].includes(player?.number))
            throw new Error('handle stop move' + player);
          room.stopMoving(player.number);
        }
      }
    } catch (error) {
      console.error('Error while handling stop moving:', error);
    }
  }

  @SubscribeMessage('options')
  async handleOptions(client: Socket, options: Options) {
    try {
      const userCookie = this.getUserWithCookie(client);
      if (!userCookie) return;

      const existingRoom = this.whichRoom(userCookie);
      if (existingRoom) {
        const existingPlayer = existingRoom.PlayerManager.players.find(
          (p) => p.user.public_id === userCookie.public_id,
        );

        if (existingPlayer && existingPlayer.disconnected) {
          await existingRoom.PlayerManager.reconnectPlayer(existingPlayer, {
            user: userCookie,
            client,
          });
          return;
        }
      }
      if (!(await this.isConnected(userCookie))) {
        this.addUserToMap(userCookie, client);

        // else {

        if (options?.key) await this.joinPrivateRoom(client, options);
        else if (options?.uuid) await this.inviteToRoom(client, options);
        else await this.randomRoom(client, options);
        // else
        // }
      }
    } catch (error) {
      console.error('Error while handling connection:', error);
    }
  }

  async joinPrivateRoom(client: Socket, options: Options) {
    // console.log('JOIN PRIVATE ROOM');
    try {
      const userCookie = this.getUserWithCookie(client);
      if (!userCookie || !options?.key) return;
      const room = this.rooms.find((r) => r.key === options.key);
      if (!room) return;
      await room.PlayerManager.addPlayer({ user: userCookie, client });
    } catch (error) {
      console.error('Error while handling join private room:', error);
    }
  }

  async inviteToRoom(client: Socket, options: Options) {
    // console.log('INVITE TO ROOM');
    try {
      const userCookie = this.getUserWithCookie(client);
      if (!userCookie) return;

      const roomPrivate = this.createRoom(options);
      if (!roomPrivate) return;
      await roomPrivate.PlayerManager.addPlayer({ user: userCookie, client });

      // console.log('MAGIC KEY:', roomPrivate.key);
      client.emit('waiting-friend', {
        uuid: options!.uuid,
        key: roomPrivate.key,
      });

      if (!(await this.isConnected(userCookie))) {
        this.addUserToMap(userCookie, client);
      }
    } catch (error) {
      console.error(
        'Error while handling inviteSubscribeMessage to room:',
        error,
      );
    }
  }

  async randomRoom(client: Socket, options?: Options) {
    // console.log('RANDOM ROOM');
    try {
      const userCookie = this.getUserWithCookie(client);
      if (!userCookie) return;
      const room = this.findOrCreateRoom(options);
      if (!room) return;
      await room.PlayerManager.addPlayer({ user: userCookie, client });

      // console.log('random room:', PongRoom.id);
    } catch (error) {
      console.error('Error while handling random room:', error);
    }
  }
}
