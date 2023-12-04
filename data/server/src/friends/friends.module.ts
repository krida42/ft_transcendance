import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Friends } from 'db/models/friends';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';

import { User } from 'db/models/user';
import { UsersService } from '../users/users.service';

@Module({
  imports: [SequelizeModule.forFeature([Friends, User])],
  controllers: [FriendsController],
  providers: [FriendsService, UsersService],
  exports: [FriendsService],
})
export class FriendsModule {}
