import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/createUser.dto';

@UseGuards(AuthGuard('42'))
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private  AuthService: AuthService, 
    private UsersService: UsersService) {}

  @Get('42')
  async fortyTwoLogin(@Req() req) {
  }
  
  @Get('callback')
  @ApiTags('callback')
  async callback(@Req() req, @Res() res) {
    try {
      await this.UsersService.findOrCreate(req.user._json);
      res.redirect('/');
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
  async data(@Req() req) {
    console.log(req.user);
    return 'success';
  }

  @Get('logout')
  async logout(@Res() res) {
    // console.log(req.session);

    res.redirect('/');
  }

  @Get('error')
  async error(@Res() res) {
    return res.send('Erreur lors de la connexion');
  }
}
