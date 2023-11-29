import { SubscribeMessage } from '@nestjs/websockets';
import { RealtimeGateway } from './realtime.gateway';

export class ChatHandler {
  constructor(private readonly realtimeGateway: RealtimeGateway) {}

  findSocketByUserId = this.realtimeGateway.findSocketByUserId;

  @SubscribeMessage('join')
  handleJoin(client: any, payload: any): string {
    return 'Hello world!';
  }

  bindUserToChannels(userId: string, channels: any[]) {
    console.warn(
      'A VOIR avec sylvain',
      'bindUserToChannels: channels: ',
      channels,
    );
    throw new Error('Method not implemented.');
    const socket = this.findSocketByUserId(userId);
    if (!socket) return;

    channels.forEach((channel) => {
      socket.join(channel.id);
    });
  }

  unbindUserFromChannels(userId: string, channels: any[]) {
    console.warn(
      'A VOIR avec sylvain',
      'bindUserToChannels: channels: ',
      channels,
    );
    throw new Error('Method not implemented.');
    const socket = this.findSocketByUserId(userId);
    if (!socket) return;

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
    const socket = this.findSocketByUserId(fromUserId);
    if (!socket) return;

    socket.to(toUserId).emit('message', message);
  }

  #transmitMessageToRoom(roomId: string, message: unknown) {
    throw new Error('Method not implemented.');
    this.realtimeGateway.server.to(roomId).emit('message', message);
  }

  #transmitMessageOfUserToRoom(
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
}
