import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-oauth2';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42')
{
	constructor(private readonly httpService: HttpService) {
		super({
			authorizationURL: 'https://api.intra.42.fr/oauth/authorize',
			tokenURL        : 'https://api.intra.42.fr/oauth/token',
			clientID        : process.env.FORTY_TWO_UID,
			clientSecret    : process.env.FORTY_TWO_SECRET,
			callbackURL     : 'http://localhost:3001/auth/42',
			scope           : 'public',
		});
	}

  async validate(accessToken: string) {
    try {
      const response = await lastValueFrom(
        this.httpService.get('https://api.intra.42.fr/v2/me', {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
      );
      const userData = response.data;
      // console.log(userData);
      // Utilisez userData comme vous le souhaitez ici.
    } catch (error) {
      // Handle and log the error if the request fails.
      console.error('HTTP request failed:', error);
      throw new Error('Failed to fetch user data');
    }
  }
}
