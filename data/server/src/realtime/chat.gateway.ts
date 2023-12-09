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

  async bindUserToChannels(userId: string, channels: any[]) {
    throw new Error('Method not implemented.');
    const socket = await this.realtimeGateway.findSocketByUserId(userId);

    channels.forEach((channel) => {
      socket.join(channel.id);
    });
  }

  async unbindUserFromChannels(userId: string, channels: any[]) {
    throw new Error('Method not implemented.');
    const socket = await this.realtimeGateway.findSocketByUserId(userId);

    channels.forEach((channel) => {
      socket.leave(channel.id);
    });
  }

  async transmitMessageOfUserToUser(
    fromUserId: string,
    toUserId: string,
    message: unknown,
  ) {
    throw new Error('Method not implemented.');
    const socket = await this.realtimeGateway.findSocketByUserId(fromUserId);

    socket
      .to(this.roomService.getUserPersonalRoom(toUserId))
      .emit('message', message);
  }

  async transmitMessageOfUserToChannel(
    fromUserId: string,
    channelId: string,
    message: unknown,
  ) {
    throw new Error('Method not implemented.');
    const socket = await this.realtimeGateway.findSocketByUserId(fromUserId);
    socket.to(channelId).emit('message', message);
  }
}
