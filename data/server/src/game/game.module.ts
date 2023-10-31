import { GameController } from './game.controller';
import { Module } from '@nestjs/common';
import { PongGateway } from './websocket/pong.gateway';
import { UsersModule } from 'src/users/users.module';
import { GameService } from './game.service';

@Module({
    imports: [UsersModule],
    controllers: [GameController,],
    providers: [GameService, PongGateway],
})
export class GameModule { }
