import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { cookieExtractor } from './jwt.strategy';

@Injectable()
export class Jwt2faStrategy extends PassportStrategy(Strategy, 'jwt-2fa') {
  constructor(private readonly UsersService: UsersService) {
    super({
      jwtFromRequest: cookieExtractor,
      secretOrKey: process.env.JWT_SECRET ,
    });
  }

  async validate(payload: any) {
    try
    {
      const user = await this.UsersService.findById(payload.public_id);
      if (!user.twoFactorEnable) {
        return user;
      }
      else if (payload.twoFactorAuthenticated) {
        return user;
      }
    }catch(error)
    {
      console.error('Error validation token 2fa: ', error);
      return null;
    }
  }
}
