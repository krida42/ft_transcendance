import { Injectable, Req, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ResponseUserDto } from 'src/users/dto/reponseUser.dto';
import { UsersService } from '../users/users.service';
import { access } from 'fs';
import { cookieExtractor } from './strategy/jwt.strategy';


export function userToPayload(user: ResponseUserDto) {
  const payload = {
    login: user.login,
    public_id: user.public_id,
    pseudo: user.pseudo,
    email: user.email,
    image_link: user.image_link,
    phone: user.phone,
    roles: user.roles,
  };
  return payload;
}
@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService,
    private readonly UsersService: UsersService) {}

  async login(user: ResponseUserDto): Promise<{ access_token: string, refreshToken: string }> {
    const payload = userToPayload(user);
    return {
      access_token: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '120s' }),
    };
  }

  async refresh(user: ResponseUserDto) {
    const payload = userToPayload(user);
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async logout(user: ResponseUserDto) {
    console.log('Deconnexion of: ', user.login);
    await this.UsersService.updateUser(user.public_id, {refreshToken: null});
  }
}
