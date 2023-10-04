import { Injectable, NestMiddleware, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import * as jwt from 'jsonwebtoken';
import { ResponseUserDto } from 'src/users/dto/reponseUser.dto';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
@UseGuards(AuthGuard('jwt-refresh'))
export class RefreshMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: any, res: any, next: () => void) {
    try {
      const accessToken = req.cookies.access_token;
      if (!accessToken) {
        return next();
      }
      jwt.verify(accessToken, process.env.JWT_SECRET as string);
    } 
    catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        //Verifications a ajouter blacklist?
        const user = jwt.decode(req.cookies.access_token) as ResponseUserDto;
        console.log('Token access expired, refreshing... user:', user.login);
        const jwtAccess = await this.authService.refresh(user);
        res.cookie('access_token', jwtAccess.access_token, { httpOnly: true });
      } else {
        console.error('Erreur lors du rafraîchissement automatique du jeton:', error);
        return next();
      }
     return next();
    }
    return next();
  }
}
