import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-oauth2';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

// @Injectable()
// export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
//   constructor(private readonly httpService: HttpService) {
//     super({
//       authorizationURL: process.env.FORTY_TWO_AUTH_URL,
//       tokenURL: process.env.FORTY_TWO_TOKEN_URL,
//       clientID: process.env.FORTY_TWO_UID,
//       clientSecret: process.env.FORTY_TWO_SECRET,
//       callbackURL: process.env.CALLBACK_URL,
//       scope: 'public',
//       state: true,
//     });
//   }

//   async validate(accessToken: string, refreshToken: string, profile: any) {
//     try {      
//       const { data } = await lastValueFrom(
//         this.httpService.get('https://api.intra.42.fr/v2/me', {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         }),
//       );
//       // console.log(data);
//       return data;
//     } catch (error) {
//       // Handle and log the error if the request fails.
//       console.error('HTTP request failed:', error);
//       throw new Error('Failed to fetch user data');
//     }
//   }
// }
