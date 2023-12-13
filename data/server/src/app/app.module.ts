import { GameService } from '../game/game.service';
import { GameModule } from './../game/game.module';
import { ChannelsModule } from '../channels/channels.module';
import { FriendsModule } from './../friends/friends.module';
import { AuthService } from 'src/authentication/auth.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

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

import { RealtimeModule } from 'src/realtime/realtime.module';
import { JwtAuthGuard } from 'src/authentication/guards/jwt.guard';
import { Jwt2faAuthGuard } from 'src/authentication/guards/2fa.guard';
import { MessageModule } from 'src/message/message.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      // rootPath: join(__dirname, '..', 'client'),
      rootPath: "/app/dist/public/",
    }),
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
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
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
    GameModule,
    MessageModule,
    RealtimeModule,
  ],
  controllers: [AppController],
  providers: [JwtService, BcryptService, AppService, JwtAuthGuard, Jwt2faAuthGuard],
  exports: [SequelizeModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RefreshMiddleware)
      .forRoutes('*');
  }
}
