import { SubscribeMessage } from '@nestjs/websockets';
import { RealtimeGateway } from './realtime.gateway';
import { Status, StatusDto } from './dto/status.dto';

export class FriendsHandler {
  constructor(private readonly realtimeGateway: RealtimeGateway) {}

  pingUserGotFriendRequest(userId: string) {
    const socket = this.realtimeGateway.findSocketByUserId(userId);
    if (socket) {
      socket.emit('gotFriendRequest');
    }
  }

  bindUserToFriends(userId: string, friends: any[]) {
    console.warn(
      'A VOIR avec sylvain',
      'bindUserToChannels: channels: ',
      friends,
    );
    throw new Error('Method not implemented.');
    const socket = this.realtimeGateway.findSocketByUserId(userId);
    if (!socket) return;
    friends.forEach((friend) => {
      socket.join(this.realtimeGateway.getUserFriendsRoom(friend.public_id));
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
    if (!socket) return;
    friends.forEach((friend) => {
      socket.leave(this.realtimeGateway.getUserFriendsRoom(friend.public_id));
    });
  }

  transmitStatusOfUserToConnectedFriends(userId: string, status: Status) {
    const socket = this.realtimeGateway.findSocketByUserId(userId);
    if (!socket) return;

    socket
      .to(this.realtimeGateway.getUserFriendsRoom(userId))
      .emit('status', new StatusDto(userId, status));

    // friends.forEach((friend) => {
    //   if (this.realtimeGateway.findSocketByUserId(friend.id)) {
    //     socket.to(friend.public_id).emit('status', new StatusDto(userId, status));
    //   }
    // });
  }
}
