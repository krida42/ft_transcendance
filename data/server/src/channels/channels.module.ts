import { ChannelsService } from './channels.service';
import { ChannelsController } from './channels.controller';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from '../users/users.module';

import { Channels } from 'db/models/channels';
import { ChannelsUsers } from 'db/models/channelsUsers';

@Module({
    imports: [
        SequelizeModule.forFeature([Channels, ChannelsUsers]),
        UsersModule
    ],
    controllers: [ChannelsController],
    providers: [ChannelsService],
    exports: [ChannelsService],
})
export class ChannelsModule {}
