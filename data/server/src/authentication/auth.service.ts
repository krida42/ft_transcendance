import axios from 'axios';
import { HttpService } from '@nestjs/axios';
import { Injectable, Req } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FortyTwoStrategy } from './42.strategy';
import { User } from 'db/models/user';

@Injectable()
export class AuthService {

    constructor(private readonly jwtService: JwtService) {}

    async generateJwtToken(user: any): Promise<string> {
      const payload = {
        id: user.userId,
        username: user.username,
        email: user.email,
        // Autres informations si nécessaires
      };
  
      return this.jwtService.sign(payload);
    }
  
    async login(user: any) {
      const payload = { username: user.username, sub: user._id };
      return {
          access_token: this.jwtService.sign(payload),
      };
  }

  }