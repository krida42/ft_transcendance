import { PassportStrategy } from "@nestjs/passport";
import { User } from "db/models/user";
import { Strategy } from "passport-jwt";
import { AuthService } from '../auth.service';
import { ExpiredTokenException, InvalidTokenException, UserNotFoundException } from "src/exceptions/exceptions";
import { cookieExtractor } from "./jwt.strategy";
import * as jwt from 'jsonwebtoken';
import { response } from "express";
export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    try{
      const user = await User.findOne({
        where: { public_id: payload.public_id },
        attributes: ['refreshToken'],
      });
      if (!user)
        throw new UserNotFoundException();
      if (user.refreshToken)
      {
        jwt.verify(user.refreshToken, process.env.JWT_SECRET as string);
        return payload;
      }
      else
        throw new InvalidTokenException();
    }
    catch (error){
      if (error instanceof jwt.TokenExpiredError){
        console.error('Refresh token expired: ', error.message);
        throw new ExpiredTokenException();
      }
      else
        console.error('Error during validation token:', error);
    }
  }
}