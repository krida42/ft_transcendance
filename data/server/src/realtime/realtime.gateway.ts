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
import { FriendsService } from 'src/friends/friends.service';
import { PublicUserDto } from 'src/users/dto/publicUser.dto';
import { ChannelsGetService } from 'src/channels/channels-get.service';

@WebSocketGateway(WebSocketGatewayOptions)
export class RealtimeGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly roomService: RoomService,
    @Inject(forwardRef(() => FriendsGateway))
    private friendsGateway: FriendsGateway,
    @Inject(forwardRef(() => ChatGateway))
    private chatGateway: ChatGateway,
    @Inject(forwardRef(() => FriendsService))
    private readonly friendsService: FriendsService,
    @Inject(forwardRef(() => ChannelsGetService))
    private readonly channelsGetService: ChannelsGetService,
  ) {}

  @WebSocketServer() server!: Server;
  // private logger: Logger = new Logger('AppGateway');

  afterInit(server: Server) {}

  async handleConnection(client: Socket) {
    client.data.user = this.getUserWithCookie(client);
    if (!client.data.user) {
      console.log("Socket: Client doesn't have a cookie, disconnecting");
      client.disconnect();
      return;
    }
    client.join(
      this.roomService.getUserPersonalRoom(client.data.user.public_id),
    );
    // client.join(
    //   this.roomService.getUserFriendsRoom(client.data.user.public_id),
    // );

    try {
      const friends = await this.friendsService.getFriends(
        client.data.user.public_id,
      );
      await this.friendsGateway.bindUserToFriends(
        client.data.user.public_id,
        friends.map((friend) => friend.id),
      );

      const channels = await this.channelsGetService.getJoinedChan(
        client.data.user.public_id,
      );
      console.log(
        'channels: ',
        channels.map((channel) => channel.chanName),
      );
      await this.chatGateway.bindUserToChannels(
        client.data.user.public_id,
        channels.map((channel) => channel.chanId),
      );
    } catch (error) {
      console.error('handleConnection getFriends: ', error);
    }

    // console.log('all my friends: ', friends);
    console.log('Socket: client.data.user.pseudo: ', client.data.user.pseudo);
  }

  handleDisconnect(client: Socket) {
    client
      .to(this.roomService.getUserFriendsRoom(client.data.user.public_id))
      .emit(
        'status',
        new StatusDto(client.data.user.public_id, Status.Offline),
      );
  }

  getUserWithCookie(socket: Socket): ResponseUserDto | null {
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
  }

  findSocketBySocketId(id: string): Socket | undefined {
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
