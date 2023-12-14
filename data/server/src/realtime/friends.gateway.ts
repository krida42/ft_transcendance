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
import { Options } from 'src/game/type';
import { PublicUserDto } from 'src/users/dto/publicUser.dto';

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
    client.data.status = status;
    client
      .to(this.roomService.getUserFriendsRoom(client.data.user.public_id))
      .emit('status', new StatusDto(client.data.user.public_id, status));

    return new StatusDto(client.data.user.public_id, status);
  }

  @SubscribeMessage('invite-to-play')
  async handleInviteToPlay(
    @MessageBody() invitationInfo: Options,
    @ConnectedSocket() client: Socket,
  ) {
    if (!invitationInfo || !invitationInfo.uuid || !invitationInfo.key) {
      console.error('No invitation info: ', invitationInfo);
      throw new Error('No invitation info');
    }
    client
      .to(this.roomService.getUserPersonalRoom(invitationInfo.uuid))
      .emit('got-invite-to-play', invitationInfo.key);
  }
  async pingUserFriendsStateChanged(userId: string) {
    const socket = await this.realtimeGateway.findSocketByUserId(userId);
    socket.emit('friends-state-ping');
  }

  async bindUserToFriends(userId: string, friendsId: string[]) {
    const socket = await this.realtimeGateway.findSocketByUserId(userId);
    friendsId.forEach((friendId) => {
      socket.join(this.roomService.getUserFriendsRoom(friendId));
    });
  }

  async unbindUserFromFriends(userId: string, friendsId: string[]) {
    const socket = await this.realtimeGateway.findSocketByUserId(userId);
    friendsId.forEach((friendId) => {
      socket.leave(this.roomService.getUserFriendsRoom(friendId));
    });
  }

  async transmitStatusOfUserToConnectedFriends(userId: string, status: Status) {
    const socket = await this.realtimeGateway.findSocketByUserId(userId);
    socket
      .to(this.roomService.getUserFriendsRoom(userId))
      .emit('status', new StatusDto(userId, status));
  }
}
