import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Message as MessageModel } from 'db/models/message';
import { MessageService } from './message.service';

import { UsersModule } from 'src/users/users.module';
import { ChannelsModule } from 'src/channels/channels.module';

@Module({
  imports: [
    SequelizeModule.forFeature([MessageModel]),
    forwardRef(() => UsersModule),
    forwardRef(() => ChannelsModule),
  ],
  controllers: [],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
