import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { AuthService } from '../auth.service';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.FORTY_TWO_UID,
      clientSecret: process.env.FORTY_TWO_SECRET,
      callbackURL: process.env.CALLBACK_URL,
      authorizationURL: process.env.FORTY_TWO_AUTH_URL,
      tokenURL: process.env.FORTY_TWO_TOKEN_URL,
      scope: 'public',
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    return profile;
  }

  // Sérialisation : Stocke l'ID de l'utilisateur dans la session
  serializeUser(user: any, done: (err: Error | null, id?: any) => void) {
    done(null, user.id);
  }

  // Désérialisation : Récupère l'ID de l'utilisateur à partir de la session
  deserializeUser(id: any, done: (err: Error | null, user?: any) => void) {
    // Vous pouvez utiliser l'ID pour récupérer l'utilisateur à partir de la base de données ou d'autres sources.
    const user = ''; // Récupérez l'utilisateur par son ID

    done(null, user);
  }
}
