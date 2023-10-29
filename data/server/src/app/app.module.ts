import { ChannelsModule } from '../channels/channels.module';
import { FriendsModule } from './../friends/friends.module';
import { AuthService } from 'src/authentication/auth.service';

import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from 'src/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/authentication/auth.module';
import { HttpModule } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { BcryptService } from 'src/tools/bcrypt.service';
import { RefreshMiddleware } from 'src/authentication/refresh.middleware';
import { PongGateway } from 'src/game/websocket/pong.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../../.env',
    }),
    SequelizeModule.forRoot({
      dialect: process.env.DB_DIALECT as
        | 'mysql'
        | 'postgres'
        | 'sqlite'
        | 'mariadb',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      synchronize: true,
      autoLoadModels: true,
      logging: false,
    }),
    UsersModule,
    ChannelsModule,
    FriendsModule,
    AuthModule,
    HttpModule,
  ],
  controllers: [AppController],
  providers: [AuthService, JwtService, BcryptService, AppService, PongGateway],
  exports: [SequelizeModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RefreshMiddleware)
      .exclude({
        path: 'auth/logout',
        method: RequestMethod.POST,
      })
      .forRoutes('*');
  }
}
