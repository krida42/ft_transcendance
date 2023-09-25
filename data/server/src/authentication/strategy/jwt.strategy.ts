import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import * as request from 'supertest';
import { AuthService } from '../auth.service';

export function cookieExtractor(req: request.Request){
  let jwt = null;
  if (req && req.cookies)
    jwt = req.cookies['access_token'];
  else
    console.error('Erreur lors de la récupération des cookies');
  return jwt;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly AuthService: AuthService) {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: true, // A changer en false en prod
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
  	return { payload };
  }
}
