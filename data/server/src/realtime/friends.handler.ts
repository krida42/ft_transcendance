import {
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { RealtimeGateway } from './realtime.gateway';
import { Status, StatusDto } from './dto/status.dto';
import { RoomService } from './room.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FriendsHandler {
  constructor(
    private readonly realtimeGateway: RealtimeGateway,
    private readonly roomService: RoomService,
  ) {}

  @SubscribeMessage('status')
  handleStatus(
    @MessageBody() status: Status,
    @ConnectedSocket() client: Socket,
  ): void {
    console.log('status event, status: ', status);
    client.data.status = status;
    client
      .to(this.roomService.getUserFriendsRoom(client.data.user.public_id))
      .emit('status', new StatusDto(client.data.user.public_id, status));
  }

  pingUserGotFriendRequest(userId: string) {
    const socket = this.realtimeGateway.findSocketByUserId(userId);
    socket.emit('gotFriendRequest');
  }

  bindUserToFriends(userId: string, friends: any[]) {
    console.warn(
      'A VOIR avec sylvain',
      'bindUserToChannels: channels: ',
      friends,
    );
    throw new Error('Method not implemented.');
    const socket = this.realtimeGateway.findSocketByUserId(userId);
    friends.forEach((friend) => {
      socket.join(this.roomService.getUserFriendsRoom(friend.public_id));
    });
  }

  unbindUserFromFriends(userId: string, friends: any[]) {
    console.warn(
      'A VOIR avec sylvain',
      'bindUserToChannels: channels: ',
      friends,
    );
    throw new Error('Method not implemented');
    const socket = this.realtimeGateway.findSocketByUserId(userId);
    friends.forEach((friend) => {
      socket.leave(this.roomService.getUserFriendsRoom(friend.public_id));
    });
  }

  transmitStatusOfUserToConnectedFriends(userId: string, status: Status) {
    const socket = this.realtimeGateway.findSocketByUserId(userId);
    socket
      .to(this.roomService.getUserFriendsRoom(userId))
      .emit('status', new StatusDto(userId, status));
  }
}
