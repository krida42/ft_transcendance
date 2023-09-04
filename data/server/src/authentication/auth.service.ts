import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(private readonly httpService: HttpService) {}

  async getUsersFrom42(accessToken: string): Promise<any> {
    try {
      console.log(accessToken);
      const response = await lastValueFrom(
        this.httpService.get('https://api.intra.42.fr/v2/users', {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
      );
      const user = response.data;
      console.log(user.data);
      return user;
    } catch (error) {
      console.error('Erreur lors de la demande à l\'API 42:', error);
      throw error;
    }
  }
}
