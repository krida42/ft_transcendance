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
    client.join(client.data.user.public_id);

    console.log('Socket: client.data.user: ', client.data.user);
  }

  handleDisconnect(client: Socket) {
    console.log('Socket: Client disconnected: ', client.id);
    client.leave(client.data.user.public_id);
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
    return this.server.sockets.sockets.get(id);
  }

  findSocketByUserId(userId: string) {
    // return this.server.sockets.sockets.get(userId);
    return [...this.server.sockets.sockets.values()].find(
      (socket) => (socket.data.user as ResponseUserDto).public_id === userId,
    );
  }

  pingUserGotFriendRequest(userId: string) {
    const socket = this.findSocketByUserId(userId);
    if (socket) {
      socket.emit('gotFriendRequest');
    }
  }

  transmitMessageToUser(userId: string, message: unknown) {
    throw new Error('Method not implemented.');
    // const socket = this.findSocketByUserId(userId);
    // if (socket) {
    //   socket.emit('message', message);
    // }
    this.server.to(userId).emit('message', message);
  }

  transmitMessageToRoom(roomId: string, message: unknown) {
    throw new Error('Method not implemented.');
    this.server.to(roomId).emit('message', message);
  }

  transmitMessageOfUserToRoom(
    userId: string,
    roomId: string,
    message: unknown,
  ) {
    throw new Error('Method not implemented.');
    const socket = this.findSocketByUserId(userId);
    if (socket) {
      socket.to(roomId).emit('message', message);
    }
  }

  enterUserInRoom(userId: string, roomId: string) {
    const socket = this.findSocketByUserId(userId);
    if (socket) {
      socket.join(roomId);
    }
  }

  leaveUserFromRoom(userId: string, roomId: string) {
    const socket = this.findSocketByUserId(userId);
    if (socket) {
      socket.leave(roomId);
    }
  }

  bindUserToChannels(userId: string, channels: any[]) {
    console.warn(
      'A VOIR avec sylvain',
      'bindUserToChannels: channels: ',
      channels,
    );
    throw new Error('Method not implemented.');
    const socket = this.findSocketByUserId(userId);
    if (socket) {
      channels.forEach((channel) => {
        socket.join(channel.id);
      });
    }
  }

  unbindUserFromChannels(userId: string, channels: any[]) {
    console.warn(
      'A VOIR avec sylvain',
      'bindUserToChannels: channels: ',
      channels,
    );
    throw new Error('Method not implemented.');
    const socket = this.findSocketByUserId(userId);
    if (socket) {
      channels.forEach((channel) => {
        socket.leave(channel.id);
      });
    }
  }

  bindUserToFriends(userId: string, friends: any[]) {
    console.warn(
      'A VOIR avec sylvain',
      'bindUserToChannels: channels: ',
      friends,
    );
    throw new Error('Method not implemented.');
    const socket = this.findSocketByUserId(userId);
    if (socket) {
      friends.forEach((friend) => {
        socket.join(friend.id);
      });
    }
  }

  unbindUserFromFriends(userId: string, friends: any[]) {
    console.warn(
      'A VOIR avec sylvain',
      'bindUserToChannels: channels: ',
      friends,
    );
    throw new Error('Method not implemented');
    const socket = this.findSocketByUserId(userId);
    if (socket) {
      friends.forEach((friend) => {
        socket.leave(friend.id);
      });
    }
  }

  transmitStatusOfUserToFriends(
    userId: string,
    status: Status,
    friends: any[],
  ) {
    throw new Error('Method not implemented. Waiting for sylvain');
    const socket = this.findSocketByUserId(userId);
    if (socket) {
      friends.forEach((friend) => {
        if (this.findSocketByUserId(friend.id)) {
          socket.to(friend.id).emit('status', new StatusDto(userId, status));
        }
      });
    }
  }

  @SubscribeMessage('cuicui')
  handleCuicui(
    @MessageBody() data: object,
    @ConnectedSocket() client: Socket,
  ): object {
    console.log('cuicui event, data: ', data);
    client.emit('cocorico', {
      fromClient: data,
      id: client.id,
      user: client.data.user,
    });
    return {
      str: "Acknoledgement I'm the server, I received your message!",
      pseudo: client.data.user.pseudo,
      pseudo2: this.findSocketBySocketId(client.id).data.user.pseudo,
      pseudo3: this.findSocketByUserId(client.data.user.public_id).data.user
        .pseudo,
    };
  }
}
