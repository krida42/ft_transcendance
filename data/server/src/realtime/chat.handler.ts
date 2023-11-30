import { SubscribeMessage } from '@nestjs/websockets';
import { RealtimeGateway } from './realtime.gateway';
import { Injectable } from '@nestjs/common';
import { RoomService } from './room.service';

@Injectable()
export class ChatHandler {
  constructor(
    private readonly realtimeGateway: RealtimeGateway,
    private readonly roomService: RoomService,
  ) {}

  bindUserToChannels(userId: string, channels: any[]) {
    throw new Error('Method not implemented.');
    const socket = this.realtimeGateway.findSocketByUserId(userId);

    channels.forEach((channel) => {
      socket.join(channel.id);
    });
  }

  unbindUserFromChannels(userId: string, channels: any[]) {
    throw new Error('Method not implemented.');
    const socket = this.realtimeGateway.findSocketByUserId(userId);

    channels.forEach((channel) => {
      socket.leave(channel.id);
    });
  }

  transmitMessageOfUserToUser(
    fromUserId: string,
    toUserId: string,
    message: unknown,
  ) {
    throw new Error('Method not implemented.');
    const socket = this.realtimeGateway.findSocketByUserId(fromUserId);

    socket
      .to(this.roomService.getUserPersonalRoom(toUserId))
      .emit('message', message);
  }

  transmitMessageOfUserToChannel(
    fromUserId: string,
    channelId: string,
    message: unknown,
  ) {
    throw new Error('Method not implemented.');
    const socket = this.realtimeGateway.findSocketByUserId(fromUserId);
    socket.to(channelId).emit('message', message);
  }
}
