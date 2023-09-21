import axios from 'axios';
import { HttpService } from '@nestjs/axios';
import { Injectable, Req } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FortyTwoStrategy } from './42.strategy';
import { User } from 'db/models/user';
import { ResponseUserDto } from 'src/users/dto/reponseUser.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async generateJwtToken(user: ResponseUserDto): Promise<string> {
    return this.jwtService.sign(user);
  }

  async login(user: any) {
    const payload = { 
      login: user.login,
      public_id: user.public_id,
      pseudo: user.pseudo,
      email: user.email,
      image_link: user.image_link,
      phone: user.phone,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
