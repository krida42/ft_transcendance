import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  HttpStatus,
  Render,
  Redirect,
  Header,
  Body,
  UnauthorizedException,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import { ResponseUserDto } from 'src/users/dto/responseUser.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private AuthService: AuthService,
    private UsersService: UsersService,
  ) {}

  @UseGuards(AuthGuard('42'))
  @Get('42')
  async fortyTwoLogin(@Res() res) {}

  @UseGuards(AuthGuard('42'))
  @Get('callback')
  @ApiTags('callback')
  async callback(@Req() req, @Res() res) {
    try {
      await this.AuthService.signIn(req.user._json, res);
    } catch (error) {
      console.error(
        "Erreur lors de l'échange du code contre un jeton ou lors de la demande a l'API 42:",
        error,
      );
      res.redirect('/error');
    }
  }

  @UseGuards(AuthGuard('jwt'), AuthGuard('google'))
  @Get('google')
  async googleLogin(@Res() res) {}

  @UseGuards(AuthGuard('jwt'), AuthGuard('google'))
  @Get('google/callback')
  @ApiTags('callback')
  async googleCallback(@Req() req, @Res() res) {
    console.log('req.user:', req.user);
    console.log('Google callback');
    return res.redirect('http://localhost:8080/main/home');
  }

  @Get('test')
  @UseGuards(AuthGuard('jwt'), AuthGuard('jwt-2fa'))
  @ApiTags('test')
  @ApiParam({ name: 'token' })
  async data(@Req() req, @Res() res) {
    console.log('Passe les systemes d authentification', req.user.login);
    res.json('success');
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  @ApiParam({ name: 'token' })
  async logout(@Req() req, @Res({ passthrough: true }) res): Promise<{ message: [number]; user: ResponseUserDto }> {
    await this.AuthService.logout(req.user);
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.clearCookie('access_token');
    // return res.redirect('http://localhost:8080/main/home');
    return;
  }

  // @UseGuards(AuthGuard('jwt'))
  // @Post('2FA')
  // async twoFactorAuthentication(@Req() req, @Res() res) {
  //   const user = await this.UsersService.findUser(req.user.public_id);
  //   const secret = this.AuthService.generateTwoFactorAuthenticationSecret(user);
  //   return res.status(HttpStatus.OK);
  // }

  @Post('2fa/turn-on')
  @UseGuards(AuthGuard('jwt'))
  async turnOnTwoFactorAuth(@Req() req, @Res() res, @Body() body) {
    try {
      await this.AuthService.setTwoFactorEnable(
        req.user.public_id,
        true,
      );
      return res.status(200).json({ message: '2FA enabled !' });
    } catch (error) {
      console.error('Erreur 2FA:', error);
      res.redirect('/error');
    }
  }

  @Post('2fa/turn-off')
  @UseGuards(AuthGuard('jwt'))
  async turnOffTwoFactorAuth(@Req() req, @Res() res, @Body() body) {
    await this.AuthService.setTwoFactorEnable(
      req.user.public_id,
      false,
    );
  }

  @Post('2fa/setup')
  @UseGuards(AuthGuard('jwt'))
  async setupTwoFactorAuth(@Req() req, @Res() res) {
    console.log('2fa')
    console.log('req.user:', req.user);
    const { secret, otpAuthUrl } = await this.AuthService.generateTwoFactorSecret(req.user);
    const qrCodeDataURL = await this.AuthService.generateQrCodeDataURL(otpAuthUrl);
    return res.status(200).json({ otpAuthUrl, qrCodeDataURL });
  }

  @Post('2fa/authenticate')
  @UseGuards(AuthGuard('jwt'))
  async authenticate(@Req() req, @Res() res, @Body() body) {
    const isCodeValid = await this.AuthService.isTwoFactorAuthCodeValid(
      body.twoFactorAuthCode,
      req.user,
    );
    console.log('isCodeValid:', isCodeValid);
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    const jwt = await this.AuthService.login2fa(req.user);
    res.cookie('access_token', jwt.access_token, { httpOnly: true });
    return res.status(200).json({ message: '2FA réussi !' });
  }

  //Utile ou pas?
  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  async refresh(@Req() req, @Res() res) {
    const jwt = await this.AuthService.refresh(req.user);
    res.cookie('access_token', jwt.access_token, { httpOnly: true });
    return res.status(200).json({ message: 'Refresh réussi !' });
  }

  @Get('error')
  async error(@Res() res) {
    return res.send('Erreur lors de la connexion');
  }
}
