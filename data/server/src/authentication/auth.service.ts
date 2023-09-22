import { Injectable, Req } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ResponseUserDto } from 'src/users/dto/reponseUser.dto';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  // async generateJwtToken(user: ResponseUserDto, time): Promise<string> {
  //   return this.jwtService.sign(user, { expiresIn: ${time} });
  // }

  async login(user: ResponseUserDto) {
    const payload = { 
      login: user.login,
      public_id: user.public_id,
      pseudo: user.pseudo,
      email: user.email,
      image_link: user.image_link,
      phone: user.phone,
      roles: user.roles,
    };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }
}
