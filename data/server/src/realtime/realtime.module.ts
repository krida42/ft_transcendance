import { Module } from '@nestjs/common';
import { RealtimeGateway } from './realtime.gateway';
import { RoomService } from './room.service';
import { FriendsGateway } from './friends.gateway';
import { ChatGateway } from './chat.gateway';
import { FriendsModule } from 'src/friends/friends.module';

@Module({
  imports: [FriendsModule],
  controllers: [],
  providers: [RealtimeGateway, RoomService, FriendsGateway, ChatGateway],
  exports: [RealtimeGateway, RoomService, FriendsGateway, ChatGateway],
})
export class RealtimeModule {}
