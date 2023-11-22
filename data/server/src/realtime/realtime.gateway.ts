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
  constructor() {} // private readonly authService: AuthService, // private readonly friendsService: FriendsService, // private readonly channelService: ChannelService, // private readonly userService: UserService,

  @WebSocketServer() server: Server;
  //   private logger: Logger = new Logger('AppGateway');

  afterInit(server: Server) {
    console.log('Socket server: Initialized!');
  }

  handleConnection(client: Socket) {
    console.log('Socket: Client connected: ', client.id);
    client.data.user = this.getUserWithCookie(client);
    console.log('Socket: client.data.user: ', client.data.user);
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

  @SubscribeMessage('cuicui')
  handleCuicui(
    @MessageBody() data: Object,
    @ConnectedSocket() client: Socket,
  ): Object {
    console.log('cuicui event, data: ', data);
    client.emit('cocorico', {
      fromClient: data,
      id: client.id,
      user: client.data.user,
    });
    return "Acknoledgement I'm the server, I received your message!";
  }

  //   @SubscribeMessage('message')
  //   async handleMessage(client: Socket, payload: any): Promise<void> {
  //     const user = await this.userService.findOneById(payload.userId);
  //     const channel = await this.channelService.findOneByName(
  //       payload.channelName,
  //     );
  //     const message = await this.channelService.createMessage(
  //       payload.message,
  //       user,
  //       channel,
  //     );
  //     this.server.emit('message', message);
  //   }

  //   @SubscribeMessage('join')
  //   async handleJoin(client: Socket, payload: any): Promise<void> {
  //     const user = await this.userService.findOneById(payload.userId);
  //     const channel = await this.channelService.findOneByName(
  //       payload.channelName,
  //     );
  //     const message = await this.channelService.createMessage(
  //       `${user.username} joined the channel.`,
  //       user,
  //       channel,
  //     );
  //     this.server.emit('message', message);
  //   }

  //   @SubscribeMessage('leave')
  //   async handleLeave(client: Socket, payload: any): Promise<void> {
  //     const user = await this.userService.findOneById(payload.userId);
  //     const channel = await this.channelService.findOneByName(
  //       payload.channelName,
  //     );
  //     const message = await this.channelService.createMessage(
  //       `${user.username} left the channel.`,
  //       user,
  //       channel,
  //     );
  //     this.server.emit('message', message);
  //   }

  //   @SubscribeMessage('typing')
  //   async handleTyping(client: Socket, payload: any): Promise<void> {
  //     const user = await this.userService.findOneById(payload.userId);
  //     const channel = await this.channelService.findOneByName(
  //       payload.channelName,
  //     );
  //     const message = await this.channelService.createMessage(
  //       `${user.username} is typing...`,
  //       user,
  //       channel,
  //     );
  //     this.server.emit('message', message);
  //   }

  //   @SubscribeMessage('stopTyping')
  //   async handleStopTyping(client: Socket, payload: any): Promise<void> {
  //     const user = await this.userService.findOneById(payload.userId);
  //     const channel = await this.channelService.findOneByName(
  //       payload.channelName,
  //     );
  //     const message = await this.channelService.createMessage(
  //       `${user.username} stopped typing.`,
  //       user,
  //       channel,
  //     );
  //     this.server.emit('message', message);
  //   }
}
