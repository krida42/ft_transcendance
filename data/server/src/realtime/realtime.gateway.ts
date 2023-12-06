import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { ResponseUserDto } from 'src/users/dto/responseUser.dto';
import * as jwt from 'jsonwebtoken';

import { StatusDto, Status } from './dto/status.dto';
import { RoomService } from './room.service';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  //   transports: ['websocket'],
  //   namespace: 'cuicui',
})
export class RealtimeGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly roomService: RoomService) {}

  @WebSocketServer() server!: Server;
  //   private logger: Logger = new Logger('AppGateway');

  afterInit(server: Server) {
  }

  handleConnection(client: Socket) {

    client.data.user = this.getUserWithCookie(client);
    client.join(
      this.roomService.getUserPersonalRoom(client.data.user.public_id),
    );

  }

  handleDisconnect(client: Socket) {
  }

  getUserWithCookie(socket: Socket): ResponseUserDto | null {
    let cookie = socket.handshake.headers.cookie;
    if (!cookie) {
      return null;
    }
    cookie = cookie.split('=')[1];
    const user = jwt.decode(cookie) as ResponseUserDto;
    console.log(user);
    if (!user) {
      return null;
    }
    return user;
  }

  findSocketBySocketId(id: string): Socket | undefined {
    return this.server.sockets.sockets.get(id);
  }

  findSocketByUserId(userId: string) {
    const socket = [...this.server.sockets.sockets.values()].find(
      (socket) => (socket.data.user as ResponseUserDto).public_id === userId,
    );
    if (!socket) throw new Error('findSocketByUserId: Socket not found');
    return socket;
  }

  @SubscribeMessage('cuicui')
  handleCuicui(
    @MessageBody() data: object,
    @ConnectedSocket() client: Socket,
  ): object {
    client.emit('cocorico', {
      fromClient: data,
      id: client.id,
      user: client.data.user,
    });
    return {
      str: "Acknoledgement I'm the server, I received your message!",
      pseudo: client.data.user.pseudo,
      // pseudo2: this.findSocketBySocketId(client.id).data.user.pseudo,
      pseudo3: this.findSocketByUserId(client.data.user.public_id).data.user
        .pseudo,
    };
  }
}
