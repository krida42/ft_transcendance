import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { SubscribeMessage } from '@nestjs/websockets';
import * as jwt from 'jsonwebtoken';
import { ResponseUserDto } from 'src/users/dto/responseUser.dto';
import { PongRoom } from '../lobby/room';
import { uuidv4 } from 'src/types';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:8080',
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

  async isConnected(userCookie: ResponseUserDto): Promise<boolean> {
    try {
      const client = this.usersMap.get(userCookie.public_id);
      if (!client) return false;
      client.emit('alreadyConnected');
      const room = this.whichRoom(userCookie);
      if (room) {
        const addedPlayer = await room.PlayerManager.addPlayer({
          user: userCookie,
          client,
        });
        return addedPlayer;
      }
      return false;
    } catch (error) {
      console.error('Error while checking connection:', error);
      return false;
    }
  }

  handleConnection(client: Socket) {
    try {
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
    } catch (error) {
      console.error('Error while handling connection:', error);
    }
  }

  handleDisconnect(client: Socket) {
    try {
      const userCookie = this.getUserWithCookie(client);
      if (userCookie) {
        const room: PongRoom | undefined = this.rooms.find((r) =>
          r.PlayerManager.hasPlayer(userCookie.public_id),
        );
        if (room) {
          room.PlayerManager.removePlayer(client);
          this.usersMap.delete(userCookie.public_id);
          console.log(`Client disconnected: ${userCookie.login}`);
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

  roomNotFull() {
    try {
      return this.rooms.find((r) => !r.PlayerManager.isFull() )//&& !r.key);
    } catch (error) {
      console.error('Error while finding random room:', error);
    }
  }

  findOrCreateRoom(options?: { isPrivate: boolean; } | undefined): PongRoom | undefined {
    try {
      let room = this.roomNotFull();
      console.log('room not full:', room?.players.length);
      if (!room)
      {
        console.log('NEW ROOM');
        room = new PongRoom(this, options);
        this.rooms.push(room);
      }
      return room;
    } catch (error) {
      console.error('Error while finding or creating room:', error);
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
      if (player?.number == null || ![0, 1].includes(player?.number))
        throw new Error('handle move down' + player?.number);

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
  handleMoveUp(client: Socket) {
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

  @SubscribeMessage('joinRoom')
  handleJoinPrivateRoom(client: Socket, options: { key: uuidv4 }) {
    try {
      const userCookie = this.getUserWithCookie(client);
      if (!userCookie || !options.key ) return;
      const room = this.rooms.find((r) => r.key === options.key);
      if (!room) return;
      room.PlayerManager.addPlayer({ user: userCookie, client });
    } catch (error) {
      console.error('Error while handling join private room:', error);
    }
  }

  @SubscribeMessage('invite')
  async handleInviteToRoom(client: Socket, options: { public_id: uuidv4, isPrivate: string }) {
    try {
      const userCookie = this.getUserWithCookie(client);
      if (!userCookie) return;
      
      const roomPrivate = this.findOrCreateRoom({ isPrivate: true });
      if (!roomPrivate) return;
      
      client.emit('waitingFriend');
      //KEVIN TODO: send roomPrivate.key to the other user with the public_id 


      if (!await this.isConnected(userCookie)) {
        this.addUserToMap(userCookie, client);
      }
    } catch (error) {
      console.error('Error while handling inviteSubscribeMessage to room:', error);
    }
  }

  @SubscribeMessage('randomRoom')
  async handleRandomRoom(client: Socket) {
    try {
      const userCookie = this.getUserWithCookie(client);
      if (!userCookie) return;
      const room = this.findOrCreateRoom();
      if (!room) return;
      room.PlayerManager.addPlayer({ user: userCookie, client });
      
      console.log('random room:', PongRoom.id);
      
      if (!await this.isConnected(userCookie)) {
        this.addUserToMap(userCookie, client);
      }

      if (!room.PlayerManager.isFull())
        client.emit('waiting');
      else
        room?.players.forEach((player) => player.client.emit('play'));
    } catch (error) {
      console.error('Error while handling random room:', error);
    }
  }
  
  
}
