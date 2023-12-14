import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'db/models/user';
import { MessageModule } from 'src/message/message.module';
import { ChannelsModule } from 'src/channels/channels.module';
import { Games } from 'db/models/games';
import { UserAchievements } from 'db/models/userAchievements';
import { Achievements } from 'db/models/achievements';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Games, UserAchievements, Achievements]),
    forwardRef(() => MessageModule),
    ChannelsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
