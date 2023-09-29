import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import * as request from 'supertest';

function cookieExtractor(req: request.Request) {
  let jwt = null;
  if (req && req.cookies) jwt = req.cookies['access_token'];
  return jwt;
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
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
