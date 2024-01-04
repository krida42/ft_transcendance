import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Public } from './guards/public.decorator';
import { ResponseUserDto } from 'src/users/dto/responseUser.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private AuthService: AuthService) {}

  @Public()
  @UseGuards(AuthGuard('42'))
  @Get('42')
  async fortyTwoLogin(@Res() res: Response) {}

  @Public()
  @UseGuards(AuthGuard('42'))
  @Get('callback')
  @ApiTags('callback')
  async callback(@Req() req: Request & { user: any }, @Res() res: Response) {
    try {
      await this.AuthService.signIn(req.user._json, res);
    } catch (error) {
      console.error(
        "Erreur lors de l'échange du code contre un jeton ou lors de la demande a l'API 42:",
        error,
      );
      (res as any).redirect('/error');
    }
  }

  @Get('test')
  @Public()
  @ApiTags('test')
  @ApiParam({ name: 'token' })
  async data(@Req() req: Request & { user: any }, @Res() res: Response) {
    console.log('Passe les systemes d authentification', req.user.login);
    (res as any).json('success');
  }

  /*
  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  @ApiParam({ name: 'token' })
  async logout(@Req() req : Request & { user: any } & { user: any }, @Res({ passthrough: true }) res : Response): Promise<{ message: [number]; user: ResponseUserDto }> {
    await this.AuthService.logout(req.user);
    res.header('Access-Control-Allow-Origin', '${process.env.VUE_APP_CUICUI}:8080');
    res.clearCookie('access_token');
    // return (res as any).redirect('${process.env.VUE_APP_CUICUI}:8080/main/home');

    return { message: [1], user: req.user};
  }
  */

  // @UseGuards(AuthGuard('jwt'))
  // @Post('2FA')
  // async twoFactorAuthentication(@Req() req : Request & { user: any }, @Res() res : Response) {
  //   const user = await this.UsersService.findUser(req.user.public_id);
  //   const secret = this.AuthService.generateTwoFactorAuthenticationSecret(user);
  //   return (res as any).status(HttpStatus.OK);
  // }

  @Get('2fa/is-enabled')
  @Public()
  @UseGuards(AuthGuard('jwt'))
  async isTwoFactorAuthEnabled(
    @Req() req: Request & { user: any },
    @Res() res: Response,
  ) {
    const isTwoFactorAuthEnabled = await this.AuthService.isTwoFactorEnable(
      req.user.public_id,
    );
    return (res as any).status(200).json({ isTwoFactorAuthEnabled });
  }

  @Post('2fa/turn-on')
  @UseGuards(AuthGuard('jwt'))
  async turnOnTwoFactorAuth(
    @Req() req: Request & { user: any },
    @Res() res: Response,
    @Body() body: Body,
  ) {
    try {
      await this.AuthService.setTwoFactorEnable(req.user.public_id, true);
      return (res as any).status(200).json({ message: '2FA enabled !' });
    } catch (error) {
      console.error('Erreur 2FA:', error);
      (res as any).redirect('/error');
    }
  }

  @Post('2fa/turn-off')
  @Public()
  @UseGuards(AuthGuard('jwt'))
  async turnOffTwoFactorAuth(
    @Req() req: Request & { user: any },
    @Res() res: Response,
    @Body() body: any,
  ) {
    try {
      await this.AuthService.setTwoFactorEnable(req.user.public_id, false);
      await this.AuthService.deleteTwoFactorSecret(req.user.public_id);
      return (res as any).status(200).json({ message: '2FA disabled !' });
    } catch (error) {
      console.error('Erreur 2FA:', error);
      (res as any).redirect('/error');
    }
  }

  @Post('2fa/setup')
  @Public()
  @UseGuards(AuthGuard('jwt'))
  async setupTwoFactorAuth(
    @Req() req: Request & { user: ResponseUserDto },
    @Res() res: Response,
  ) {
    const { otpAuthUrl } = await this.AuthService.generateTwoFactorSecret(
      req.user,
    );
    const qrCodeDataURL = await this.AuthService.generateQrCodeDataURL(
      otpAuthUrl,
    );
    return (res as any).status(200).json({ otpAuthUrl, qrCodeDataURL });
  }

  @Post('2fa/authenticate')
  @Public()
  @UseGuards(AuthGuard('jwt'))
  async authenticate(
    @Req() req: Request & { user: any },
    @Res() res: Response,
    @Body() body: any,
  ) {
    const isCodeValid = await this.AuthService.isTwoFactorAuthCodeValid(
      body.twoFactorAuthCode,
      req.user,
    );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    const jwt = await this.AuthService.login2fa(req.user);
    (res as any).cookie('access_token', jwt.access_token, { httpOnly: true });
    return (res as any).status(200).json({ message: '2FA réussi !' });
  }

  @Get('error')
  async error(@Res() res: Response) {
    return (res as any).send('Erreur lors de la connexion');
  }
}
