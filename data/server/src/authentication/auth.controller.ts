import { Controller, Get, Post, Req, Res, UseGuards, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import { DeveloperGuard } from 'src/users/dev.guard';

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
      res.cookie('access_token', jwt.access_token, { httpOnly: true });
      //refresh_token: jwt.refresh_token add to user

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
  @UseGuards(AuthGuard('jwt'), DeveloperGuard)
  @ApiTags('test')
  @ApiParam({ name: 'token' })
  async data(@Req() req, @Res() res) {
    console.log(req.user);
    console.log(req.cookies);
    res.json('success');
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({ name: 'token' })
  async logout(@Req() req, @Res() res) {
    res.clearCookie('access_token');
    res.redirect('/');
  }

  @Get('error')
  async error(@Res() res) {
    return res.send('Erreur lors de la connexion');
  }
}
