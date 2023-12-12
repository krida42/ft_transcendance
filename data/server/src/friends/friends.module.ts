import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Friends } from 'db/models/friends';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';

import { User } from 'db/models/user';
import { UsersModule } from 'src/users/users.module';

import { Channels } from 'db/models/channels';
import { ChannelsUsers } from 'db/models/channelsUsers';

@Module({
  imports: [
    SequelizeModule.forFeature([Friends, User, Channels, ChannelsUsers]),
    forwardRef(() => UsersModule),
  ],
  controllers: [FriendsController],
  providers: [FriendsService],
  exports: [FriendsService],
})
export class FriendsModule {}
