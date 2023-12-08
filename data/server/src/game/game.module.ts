import { GameController } from './game.controller';
import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { GameService } from './game.service';
import { PongGateway } from './websocket/pong.gateway';
import { Games } from '../../db/models/games';
import { SequelizeModule } from '@nestjs/sequelize';
import { Achievements } from '../../db/models/achievements';
import { UserAchievements } from 'db/models/userAchievements';

@Module({
  imports: [SequelizeModule.forFeature([Games, Achievements, UserAchievements]), UsersModule],
  controllers: [GameController],
  providers: [GameService, PongGateway],
  exports: [GameService, PongGateway],
})
export class GameModule {}
