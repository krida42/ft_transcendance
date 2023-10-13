import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Channel } from 'db/models/channel';

@Module({
    imports: [SequelizeModule.forFeature([Channel])],
    controllers: [ChannelController],
    providers: [ChannelService],
    exports: [ChannelService],
})
export class ChannelModule {}
