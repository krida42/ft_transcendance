import { Controller, Get, Param, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import axios from 'axios';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  async redirectToFortyTwo(@Res() res) {
    console.log(10);
    try {
      // Rediriger l'utilisateur vers l'URL d'autorisation
      const authorizationURL = await this.authService.getAuthorizationUrl();
      return res.redirect(authorizationURL);
    } catch (error) { 
      console.error("Erreur lors de la redirection vers l'API 42:", error);
      throw error;
    }
  }

  @Get('callback')
  async FortyTwoCallback(@Req() req, @Res() res) {
    console.log(7)
    try {

      const accessToken = await this.authService.getAccessToken(req);
      console.log("accessToken222 = ",accessToken);
      const users = await this.authService.getUsersFrom42(accessToken);

      res.redirect('/');
    } catch (error) {
      console.error('Erreur lors de l\'échange du code contre un jeton ou lors de la demande a l\'API 42:', error);
      res.redirect('/error');
    }
  }

  @Get('error')
  async error(@Res() res) {
    return res.send('Erreur lors de la connexion');
  }
}
