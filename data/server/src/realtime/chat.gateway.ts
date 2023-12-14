import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { RealtimeGateway } from './realtime.gateway';
import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { RoomService } from './room.service';
import { WebSocketGatewayOptions } from './gateway.conf';

@WebSocketGateway(WebSocketGatewayOptions)
export class ChatGateway {
  constructor(
    @Inject(forwardRef(() => RealtimeGateway))
    private readonly realtimeGateway: RealtimeGateway,
    private readonly roomService: RoomService,
  ) {}

  async pingChannelStateChanged(channelId: string) {
    this.realtimeGateway.server
      .to(channelId)
      .emit('channels-state-ping', channelId);
  }

  async bindUserToChannels(userId: string, channelsId: string[]) {
    const socket = await this.realtimeGateway.findSocketByUserId(userId);

    channelsId.forEach((channelId) => {
      socket.join(channelId);
    });
  }

  async unbindUserFromChannels(userId: string, channelsId: string[]) {
    const socket = await this.realtimeGateway.findSocketByUserId(userId);

    channelsId.forEach((channelId) => {
      socket.leave(channelId);
    });
  }

  async transmitMessageOfUserToUser(
    fromUserId: string,
    toUserId: string,
    message: unknown,
  ) {
    // throw new Error('Method not implemented.');
    const socket = await this.realtimeGateway.findSocketByUserId(fromUserId);

    socket
      .to(this.roomService.getUserPersonalRoom(toUserId))
      .emit('messageDirect', message);
  }

  async transmitMessageOfUserToChannel(
    fromUserId: string,
    channelId: string,
    message: unknown,
  ) {
    // throw new Error('Method not implemented.');
    const socket = await this.realtimeGateway.findSocketByUserId(fromUserId);
    socket.to(channelId).emit('messageChannel', message);
  }
}
