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

import { forwardRef, Inject } from '@nestjs/common';

import { Server, Socket } from 'socket.io';
import { ResponseUserDto } from 'src/users/dto/responseUser.dto';
import * as jwt from 'jsonwebtoken';

import { StatusDto, Status } from './dto/status.dto';
import { RoomService } from './room.service';

import { FriendsGateway } from './friends.gateway';
import { ChatGateway } from './chat.gateway';
import { WebSocketGatewayOptions } from './gateway.conf';

@WebSocketGateway(WebSocketGatewayOptions)
export class RealtimeGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly roomService: RoomService,
    @Inject(forwardRef(() => FriendsGateway))
    private friendsHandler: FriendsGateway,
    @Inject(forwardRef(() => ChatGateway))
    private chatHandler: ChatGateway,
  ) {}

  @WebSocketServer() server: Server;
  // private logger: Logger = new Logger('AppGateway');

  afterInit(server: Server) {
    console.log('Socket server: Initialized!');
  }

  handleConnection(client: Socket) {
    console.log('Socket: Client connected: ', client.id);

    client.data.user = this.getUserWithCookie(client);
    client.join(
      this.roomService.getUserPersonalRoom(client.data.user.public_id),
    );

    console.log('Socket: client.data.user.pseudo: ', client.data.user.pseudo);
  }

  handleDisconnect(client: Socket) {
    console.log('Socket: Client disconnected: ', client.id);
  }

  getUserWithCookie(socket: Socket): ResponseUserDto | null {
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

  findSocketBySocketId(id: string): Socket {
    console.log('- - --  --  -- - - - ALL SOCKETS: ', this.server.allSockets());
    return this.server.sockets.sockets.get(id);
  }

  async findSocketByUserId(userId: string) {
    // const socket = [...this.server.sockets.sockets.values()].find(
    //   (socket) => (socket.data.user as ResponseUserDto).public_id === userId,
    // );
    const socket = await this.server
      .in(this.roomService.getUserPersonalRoom(userId))
      .fetchSockets();
    console.log('taille de fetchSockets: ', socket.length);
    // console.log('socket heyhey: ', socket[0].data);
    if (!socket[0]) throw new Error('findSocketByUserId: Socket not found');
    return socket[0] as unknown as Socket;
  }

  @SubscribeMessage('cuicui')
  async handleCuicui(
    @MessageBody() data: object,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('cuicui event, data: ', data);
    client.emit('cocorico', {
      fromClient: data,
      id: client.id,
      user: client.data.user,
    });
    return {
      str: "Acknoledgement I'm the server, I received your message!",
      pseudo: client.data.user.pseudo,
      // pseudo2: this.findSocketBySocketId(client.id).data.user.pseudo,
      pseudo3: (await this.findSocketByUserId(client.data.user.public_id)).data
        .user.pseudo,
    };
  }

  // handleStatus = this.friendsHandler.handleStatus.bind(this.friendsHandler);
}
