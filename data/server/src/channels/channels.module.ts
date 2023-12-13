import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from '../users/users.module';
import { FriendsModule } from '../friends/friends.module';

// Models
import { Channels } from 'db/models/channels';
import { ChannelsUsers } from 'db/models/channelsUsers';

// Controller
import { ChannelsController } from './channels.controller';

// Providers
import { ChannelsService } from './channels.service';
import { ChannelsGetService } from './channels-get.service';
import { ChannelsOpService } from './channels-op.service';
import { ChannelsUtilsService } from './channels-utils.service';
import { join } from 'path';
import { MessageModule } from 'src/message/message.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Channels, ChannelsUsers]),
    forwardRef(() => FriendsModule),
    forwardRef(() => UsersModule),
    forwardRef(() => MessageModule),
  ],
  controllers: [ChannelsController],
  providers: [
    ChannelsService,
    ChannelsGetService,
    ChannelsOpService,
    ChannelsUtilsService,
  ],
  exports: [ChannelsService, ChannelsUtilsService, ChannelsGetService],
})
export class ChannelsModule {
  constructor() {
    const publicFolderPath = join(__dirname, '..', 'public');
  }
}
