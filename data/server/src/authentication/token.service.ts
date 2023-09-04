import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class TokenService {
  async getUserData(accessToken: string): Promise<any> {
    try {
      const response = await axios.get('https://api.intra.42.fr/v2/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Erreur lors de l'appel à l'API de 42.`);
    }
  }
}
