import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Friends } from 'db/models/friends';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';

import { User } from 'db/models/user';
import { UsersModule } from 'src/users/users.module';

import { Channels } from 'db/models/channels';
import { ChannelsUsers } from 'db/models/channelsUsers';
import { RealtimeModule } from 'src/realtime/realtime.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Friends, User, Channels, ChannelsUsers]),
    forwardRef(() => UsersModule),
    forwardRef(() => RealtimeModule),
  ],
  controllers: [FriendsController],
  providers: [FriendsService],
  exports: [FriendsService],
})
export class FriendsModule {}
