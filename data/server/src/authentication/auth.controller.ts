import { Controller, Get, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  async redirectToFortyTwo(@Req() req, @Res() res) {
    try {
      // Rediriger l'utilisateur vers l'URL d'autorisation
      // res.render('login');
      const authorizationURL = await this.authService.getAuthorizationUrl();
      return res.redirect(authorizationURL);
    } catch (error) {
      console.error("Erreur lors de la redirection vers l'API 42:", error);
      throw error;
    }
  }

  @Get('callback')
  async FortyTwoCallback(@Req() req, @Res() res) {
    try {
      const accessToken = await this.authService.getAccessToken(req);
      const users = await this.authService.getUsersFrom42(accessToken, 95263);

      res.redirect('/');
    } catch (error) {
      console.error(
        "Erreur lors de l'échange du code contre un jeton ou lors de la demande a l'API 42:",
        error,
      );
      res.redirect('/error');
    }
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
