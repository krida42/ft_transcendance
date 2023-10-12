import { APP_FILTER } from '@nestjs/core';
import { FriendsModule } from './../friends/friends.module';
import { AuthService } from 'src/authentication/auth.service';
import { PasswordService } from './../users/password.service';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from 'src/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/authentication/auth.module';
import { HttpModule } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    FriendsModule,
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
    AuthModule,
    HttpModule,
  ],
  controllers: [AppController],
  providers: [AuthService, JwtService, PasswordService, AppService],
  exports: [SequelizeModule], // pour que les autres modules puissent utiliser SequelizeModule
})
export class AppModule { }
