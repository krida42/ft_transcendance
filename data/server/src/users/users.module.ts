import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'db/models/user';
import { MessageModule } from 'src/message/message.module';
import { ChannelsModule } from 'src/channels/channels.module';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    forwardRef(() => MessageModule),
    ChannelsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
