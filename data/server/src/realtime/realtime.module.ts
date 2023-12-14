import { Module, forwardRef } from '@nestjs/common';
import { RealtimeGateway } from './realtime.gateway';
import { RoomService } from './room.service';
import { FriendsGateway } from './friends.gateway';
import { ChatGateway } from './chat.gateway';
import { FriendsModule } from 'src/friends/friends.module';
import { ChannelsModule } from 'src/channels/channels.module';

@Module({
  imports: [forwardRef(() => FriendsModule), forwardRef(() => ChannelsModule)],
  controllers: [],
  providers: [RealtimeGateway, RoomService, FriendsGateway, ChatGateway],
  exports: [RealtimeGateway, RoomService, FriendsGateway, ChatGateway],
})
export class RealtimeModule {}
