import { Injectable, Res, ResponseDecoratorOptions } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ResponseUserDto } from 'src/users/dto/responseUser.dto';
import { UsersService } from '../users/users.service';
import { Json } from 'sequelize/types/utils';
import { authenticator } from 'otplib';
import { User } from 'db/models/user';
import QRCode, { toDataURL } from 'qrcode';
import { uuidv4 } from 'src/types';

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
    return await this.redirectSignIn(user, res);
  }

  async redirectSignIn(user: ResponseUserDto, res: any): Promise<Response> {
    if ((await this.isTwoFactorEnable(user.public_id)) !== null) {
      if ((await this.isTwoFactorEnable(user.public_id)) === false)
        return res.redirect(`${process.env.VUE_APP_CUICUI}:8080/main/home`);
      if (await this.hasTwoFactorSecret(user.public_id))
        return res.redirect(`${process.env.VUE_APP_CUICUI}:8080/auth/2FA-code`);
      return res.redirect(`${process.env.VUE_APP_CUICUI}:8080/auth/2FA-QR`);
    }
    return res.redirect(`${process.env.VUE_APP_CUICUI}:8080/auth/2FA-enable`);
  }

  async login(
    user: ResponseUserDto,
  ): Promise<{ access_token: string; refreshToken: string }> {
    user.twoFactorAuthenticated = false;
    const payload = {
      ...userToPayload(user),
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
    user.twoFactorAuthenticated = true;
    const payload = {
      ...userToPayload(user),
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

  async setTwoFactorSecret(secret: string, public_id: uuidv4) {
    await this.UsersService.updateUser(public_id, {
      twoFactorSecret: secret,
    });
  }

  async deleteTwoFactorSecret(public_id: uuidv4) {
    await this.UsersService.updateUser(public_id, {
      twoFactorSecret: undefined,
    });
  }

  async setTwoFactorEnable(public_id: uuidv4, bool: boolean) {
    await this.UsersService.updateUser(public_id, {
      twoFactorEnable: bool,
    });
  }

  async isTwoFactorEnable(public_id: uuidv4): Promise<boolean> {
    return (await this.UsersService.findById(public_id)).twoFactorEnable;
  }

  async hasTwoFactorSecret(public_id: uuidv4): Promise<boolean> {
    return (
      (await this.UsersService.findById(public_id)).twoFactorSecret !== null
    );
  }

  async generateTwoFactorSecret(user: ResponseUserDto) {
    const secret = authenticator.generateSecret();
    const otpAuthUrl = authenticator.keyuri(user.login, 'service name', secret);
    await this.setTwoFactorSecret(secret, user.public_id);
    return {
      secret,
      otpAuthUrl,
    };
  }

  async isTwoFactorAuthCodeValid(
    twoFactorAuthCode: string,
    resUser: ResponseUserDto,
  ) {
    const dbUser = await User.findOne({
      where: { public_id: resUser.public_id },
      attributes: ['twoFactorSecret'],
    });
    const secret = dbUser?.twoFactorSecret;

    return authenticator.verify({
      token: twoFactorAuthCode,
      secret: secret || '',
    });
  }

  async generateQrCodeDataURL(otpAuthUrl: string) {
    return toDataURL(otpAuthUrl);
  }
}
