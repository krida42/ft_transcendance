import { Controller, Get, Post, Req, Res, UseGuards, HttpStatus } from '@nestjs/common';
import { AuthService, userToPayload } from './auth.service';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';

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
      const user = await this.UsersService.findOrCreate(req.user._json);
      const jwt = await this.AuthService.login(user);
      await this.UsersService.updateUser(user.public_id, {refreshToken: jwt.refreshToken});

      res.cookie('access_token', jwt.access_token, { httpOnly: true });
      return res.send('Authentification réussie !');
    } catch (error) {
      console.error(
        "Erreur lors de l'échange du code contre un jeton ou lors de la demande a l'API 42:",
        error,
      );
      res.redirect('/error');
    }
  }

  @Get('test')
  @UseGuards(AuthGuard('jwt'))
  @ApiTags('test')
  @ApiParam({ name: 'token' })
  async data(@Req() req, @Res() res) {
    console.log('req.user:', req.user);
    console.log('req.cookies', req.cookies);
    res.json('success');
  }


  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({ name: 'token' })
  async logout(@Req() req, @Res() res) {
    this.AuthService.logout(req.user.payload);
    res.clearCookie('access_token');
  }

  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  async refresh(@Req() req, @Res() res) {
    const jwt = await this.AuthService.refresh(req.user);
    res.cookie('access_token', jwt.access_token, { httpOnly: true });
    res.status(HttpStatus.OK).json({ message: 'Refresh réussi' });
  }

  @Get('error')
  async error(@Res() res) {
    return res.send('Erreur lors de la connexion');
  }
}
