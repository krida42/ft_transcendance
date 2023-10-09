import { Controller, Get, Post, Req, Res, UseGuards, HttpStatus, Render, Redirect } from '@nestjs/common';
import { AuthService, userToPayload } from './auth.service';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import { ResponseUserDto } from 'src/users/dto/reponseUser.dto';
import { GoogleOauthGuard } from './google.guard';


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
      return res.redirect('http://localhost:8080/main/home');
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
  @UseGuards(AuthGuard('jwt'))
  @ApiTags('test')
  @ApiParam({ name: 'token' })
  async data(@Req() req, @Res() res) {
    console.log('req.user:', req.user);
    console.log('req.cookies1', req.cookies.access_token);
    res.json('success');
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({ name: 'token' })
  async logout(@Req() req, @Res() res): Promise<{ message: [number], user: ResponseUserDto, res:Response }> {
    res.clearCookie('access_token');
    return await this.AuthService.logout(req.user.payload), res.status(200).json({ message: 'Déconnexion réussie !' });
  }

  //Utile ou pas?
  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  async refresh(@Req() req, @Res() res) {
    const jwt = await this.AuthService.refresh(req.user);
    res.cookie('access_token', jwt.access_token, { httpOnly: true });
    return res.status(200).json({ message:('Refresh réussi !') });
  }

  @Get('error')
  async error(@Res() res) {
    return res.send('Erreur lors de la connexion');
  }
}
