import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class RoomService {
  constructor() {}
  getUserPersonalRoom(userId: string): string {
    return `user:${userId}`;
  }

  getUserFriendsRoom(userId: string): string {
    return `friends:${userId}`;
  }
}
