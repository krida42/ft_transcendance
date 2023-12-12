import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Friends } from 'db/models/friends';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';

import { User } from 'db/models/user';
import { UsersService } from '../users/users.service';
import { ChannelsModule } from 'src/channels/channels.module';

@Module({
  imports: [SequelizeModule.forFeature([Friends, User]), forwardRef(() => ChannelsModule)],
  controllers: [FriendsController],
  providers: [FriendsService, UsersService],
  exports: [FriendsService],
})
export class FriendsModule {}
