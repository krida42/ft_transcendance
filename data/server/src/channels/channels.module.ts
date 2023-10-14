import { ChannelsService } from './channels.service';
import { ChannelsController } from './channels.controller';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Channels } from 'db/models/channels';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [
        SequelizeModule.forFeature([Channels]),
        UsersModule
    ],
    controllers: [ChannelsController],
    providers: [ChannelsService],
    exports: [ChannelsService],
})
export class ChannelsModule {}
