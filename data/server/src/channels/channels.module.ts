import { ChannelsService } from './channels.service';
import { ChannelsGetService } from './channels-get.service';
import { ChannelsOpService } from './channels-op.service';
import { ChannelsController } from './channels.controller';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from '../users/users.module';
import { FriendsModule } from '../friends/friends.module';

import { Channels } from 'db/models/channels';
import { ChannelsUsers } from 'db/models/channelsUsers';

@Module({
    imports: [
        SequelizeModule.forFeature([Channels, ChannelsUsers]),
        UsersModule,
        FriendsModule
    ],
    controllers: [ChannelsController],
    providers: [ChannelsService, ChannelsGetService, ChannelsOpService],
    exports: [ChannelsService],
})
export class ChannelsModule {}
