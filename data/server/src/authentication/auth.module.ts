import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { FortyTwoStrategy } from './strategy/42.strategy';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { RefreshJwtStrategy } from './strategy/refreshToken.strategy';
import { GoogleStrategy } from './strategy/google.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    HttpModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RefreshJwtStrategy, FortyTwoStrategy, GoogleStrategy],
  exports: [AuthService],
})
export class AuthModule {}
