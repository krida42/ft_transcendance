import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import * as request from 'supertest';
import { UsersService } from '../../users/users.service';

export function cookieExtractor(req: request.Request) {
  let jwt = null;
  if (req && req.cookies) jwt = req.cookies['access_token' as any];
  else console.error('Erreur lors de la récupération des cookies');
  return jwt;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly UsersService: UsersService) {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    try {
      if (payload) {
        const user = await this.UsersService.findById(payload.public_id);
        if (!user)  new UnauthorizedException('User not found');
        return payload;
      }
    } catch (error) {
      console.error('Error validation token: ', error);
      return null;
    }
  }
}
