import { GameController } from './game.controller';
import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { GameService } from './game.service';
import { PongGateway } from './websocket/pong.gateway';

@Module({
    imports: [UsersModule],
    controllers: [GameController,],
    providers: [GameService, PongGateway],
    exports: [GameService, PongGateway]
})
export class GameModule { }
