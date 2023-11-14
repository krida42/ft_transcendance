import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket  } from 'socket.io';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { SubscribeMessage } from '@nestjs/websockets';
import * as jwt from 'jsonwebtoken';
import { ResponseUserDto } from 'src/users/dto/responseUser.dto';
import { PongRoom } from '../lobby/room';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket'],
})
export class PongGateway implements OnGatewayConnection, OnGatewayDisconnect{
  @WebSocketServer()
  server: Server;
  private rooms = new Array<PongRoom>();
  private usersMap = new Map<string, Socket>();

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
    return this.rooms.find(r => r.hasPlayer(user.public_id));
  }

  isConnected(userCookie: ResponseUserDto): boolean {
    const client = this.usersMap.get(userCookie.public_id);
    if (!client) {
      return false;
    }
    this.whichRoom(userCookie).addPlayer({user: userCookie, client});
    client.emit('alreadyConnected');
    return true;
  }

  handleConnection(client: Socket) {
    const userCookie = this.getUserWithCookie(client);
    if (!userCookie || this.isConnected(userCookie))
      return;
  
    this.addUserToMap(userCookie, client);
    this.addUserToRoom(userCookie, client);
  }

  addUserToMap(userCookie: ResponseUserDto, client: Socket) {
    const player = {user: userCookie, client};
    this.usersMap.set(userCookie.public_id, client);
  }
  
  addUserToRoom(userCookie: ResponseUserDto, client: Socket) {
    let room = this.findRoomForUser(userCookie);
    if (!room) {
      room = this.findOrCreateRoom();
    }
    room.addPlayer({user: userCookie, client});
  }
  
  findRoomForUser(userCookie: ResponseUserDto): PongRoom {
    return this.rooms.find(r => r.hasPlayer(userCookie.public_id));
  }
  
  findOrCreateRoom(): PongRoom {
    let room = this.rooms.find(r => !r.isFull());
    if (!room) {
      room = new PongRoom();
      this.rooms.push(room);
    }
    return room;
  }

  handleDisconnect(client: Socket) {
    const userCookie = this.getUserWithCookie(client);
    if (userCookie) {
      this.usersMap.delete(userCookie.public_id);
      const room = this.rooms.find(r => r.hasPlayer(userCookie.public_id));
      if (room)
        room.removePlayer(client);
      console.log(`Client disconnected: ${userCookie.login}`);
    }
  }

  @SubscribeMessage('moveUp')
  handleMoveUp(client: Socket) {
    const userCookie = this.getUserWithCookie(client);
    if (userCookie) {
      const room = this.rooms.find(r => r.hasPlayer(userCookie.public_id));
      if (room) {
        const player = room.players.find(p => p.client.id === client.id);
        if (player) {
          // Appeler la méthode moveUp de votre jeu ici
          room.game.moveUp(player.number);
        }
      }
    }
}

@SubscribeMessage('moveDown')
handleMoveDown(client: Socket) {
  const userCookie = this.getUserWithCookie(client);
  if (userCookie) {
    const room = this.rooms.find(r => r.hasPlayer(userCookie.public_id));
    if (room) {
      const player = room.players.find(p => p.client.id === client.id);
      if (player) {
        console.log('moveDown');
        // Appeler la méthode moveDown de votre jeu ici
        room.game.moveDown(player.number);
      }
    }
  }
}

  @SubscribeMessage('newGame')
  newGame(){
    console.log('new game');
  }
}
