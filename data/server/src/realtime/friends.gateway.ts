import {
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { RealtimeGateway } from './realtime.gateway';
import { Status, StatusDto } from './dto/status.dto';
import { RoomService } from './room.service';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { WebSocketGatewayOptions } from './gateway.conf';

@WebSocketGateway(WebSocketGatewayOptions)
export class FriendsGateway {
  constructor(
    @Inject(forwardRef(() => RealtimeGateway))
    private readonly realtimeGateway: RealtimeGateway,
    private readonly roomService: RoomService,
  ) {}

  @SubscribeMessage('status')
  handleStatus(
    @MessageBody() status: Status,
    @ConnectedSocket() client: Socket,
  ): StatusDto {
    console.log('status event, status: ', status);
    client.data.status = status;
    client
      .to(this.roomService.getUserFriendsRoom(client.data.user.public_id))
      .emit('status', new StatusDto(client.data.user.public_id, status));

    return new StatusDto(client.data.user.public_id, status);
  }

  async pingUserGotFriendRequest(userId: string) {
    const socket = await this.realtimeGateway.findSocketByUserId(userId);
    socket.emit('gotFriendRequest');
  }

  async bindUserToFriends(userId: string, friends: any[]) {
    console.warn(
      'A VOIR avec sylvain',
      'bindUserToChannels: channels: ',
      friends,
    );
    throw new Error('Method not implemented.');
    const socket = await this.realtimeGateway.findSocketByUserId(userId);
    friends.forEach((friend) => {
      socket.join(this.roomService.getUserFriendsRoom(friend.public_id));
    });
  }

  async unbindUserFromFriends(userId: string, friends: any[]) {
    console.warn(
      'A VOIR avec sylvain',
      'bindUserToChannels: channels: ',
      friends,
    );
    throw new Error('Method not implemented');
    const socket = await this.realtimeGateway.findSocketByUserId(userId);
    friends.forEach((friend) => {
      socket.leave(this.roomService.getUserFriendsRoom(friend.public_id));
    });
  }

  async transmitStatusOfUserToConnectedFriends(userId: string, status: Status) {
    const socket = await this.realtimeGateway.findSocketByUserId(userId);
    socket
      .to(this.roomService.getUserFriendsRoom(userId))
      .emit('status', new StatusDto(userId, status));
  }
}
