import { Injectable, Res, ResponseDecoratorOptions } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ResponseUserDto } from 'src/users/dto/responseUser.dto';
import { UsersService } from '../users/users.service';
import { Json } from 'sequelize/types/utils';
import { authenticator } from 'otplib';
import { User } from 'db/models/user';
import { v4 as uuidv4 } from 'uuid';
import { QRCode } from 'qrcode';

export function userToPayload(user: ResponseUserDto) {
  const payload = {
    login: user.login,
    public_id: user.public_id,
    pseudo: user.pseudo,
    email: user.email,
    avatar: user.avatar,
    phone: user.phone,
    roles: user.roles,
    twoFactorAuthenticated: user.twoFactorAuthenticated,
  };
  return payload;
}
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly UsersService: UsersService,
  ) {}

  async signIn(json: Json, res: any): Promise<Response> {
    const user = await this.UsersService.findOrCreate(json);
    const jwt = await this.login(user);
    await this.UsersService.updateUser(user.public_id, {
      refreshToken: jwt.refreshToken,
    });
    res.cookie('access_token', jwt.access_token, { httpOnly: true });
    if (await this.isTwoFactorEnable(user.public_id)) {
      console.log('2fa is enable payload:', user);
      return res.redirect('http://localhost:8080/main/2fa');
    }
    return res.redirect('http://localhost:8080/main/home');
  }

  async login(
    user: ResponseUserDto,
  ): Promise<{ access_token: string; refreshToken: string }> {
    const payload = {
      ...userToPayload(user),
      TwoFactorAuthenticated: false,
    };
    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: process.env.ACCESS_EXP,
        secret: process.env.JWT_SECRET,
      }),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: process.env.REFRESH_EXP,
        secret: process.env.JWT_SECRET,
      }),
    };
  }

  async login2fa(user: ResponseUserDto): Promise<{ access_token: string }> {
    const payload = {
      ...userToPayload(user),
      TwoFactorAuthenticated: true,
    };
    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: process.env.ACCESS_EXP,
        secret: process.env.JWT_SECRET,
      }),
    };
  }

  async refresh(user: ResponseUserDto): Promise<{ access_token: string }> {
    const payload = userToPayload(user);
    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: process.env.ACCESS_EXP,
        secret: process.env.JWT_SECRET,
      }),
    };
  }

  async logout(
    user: ResponseUserDto,
  ): Promise<{ message: [number]; user: ResponseUserDto }> {
    console.log('Deconnexion of: ', user.login);
    return await this.UsersService.updateUser(user.public_id, {
      refreshToken: null,
    });
  }

  async setTwoFactorSecret(
    secret: string,
    public_id: uuidv4,
  ): Promise<{ message: [number]; user: ResponseUserDto }> {
    return await this.UsersService.updateUser(public_id, {
      twoFactorSecret: secret,
    });
  }

  async setTwoFactorEnable(
    public_id: uuidv4,
    bool: boolean,
  ): Promise<{ message: [number]; user: ResponseUserDto }> {
    console.log('setTwoFactorEnable:', bool);
    console.log('public_id:', public_id);
    return await this.UsersService.updateUser(public_id, {
      twoFactorEnable: bool,
    });
  }

  async isTwoFactorEnable(public_id: uuidv4): Promise<boolean> {
    return (await this.UsersService.findById(public_id)).twoFactorEnable;
  }

  async generatetwoFactorSecret(user: User) {
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(
      user.email,
      process.env.APP_NAME,
      secret,
    );
    await this.setTwoFactorSecret(secret, user.public_id);

    return {
      secret,
      otpauthUrl,
    };
  }

  isTwoFactorAuthCodeValid(twoFactorAuthCode: string, user: User) {
    return authenticator.verify({
      token: twoFactorAuthCode,
      secret: user.twoFactorSecret,
    });
  }

  async generateQrCodeDataURL(otpAuthUrl: string) {
    return QRCode.toDataURL(otpAuthUrl);
  }
}
