import { GameController } from './game.controller';
import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { GameService } from './game.service';
import { PongGateway } from './websocket/pong.gateway';
import { Games } from '../../db/models/games';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([Games]), UsersModule],
  controllers: [GameController],
  providers: [GameService, PongGateway],
  exports: [GameService, PongGateway],
})
export class GameModule {}
