import { HttpService } from '@nestjs/axios';
import { Injectable, Req } from '@nestjs/common';
import axios from 'axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(private readonly httpService: HttpService) {}

  async getAuthorizationUrl(): Promise<string> {
    // Construire l'URL d'autorisation
    const clientId = "?client_id=" + process.env.FORTY_TWO_UID; // Remplacez par votre propre client ID
    const redirectUri = "&redirect_uri=" + encodeURIComponent(process.env.CALLBACK_URL); // Remplacez par votre propre URL de redirection
    const responseType = "&response_type=code";
    const scope = "&scope=public";
    const state = "&state=some-random-string-of-your-choice"; 

    const authorizationURL = `${process.env.FORTY_TWO_AUTH_URL}${clientId}${redirectUri}${responseType}${scope}${state}`;
    return authorizationURL;
  }

  async getRequestBody(@Req() req) {
    const code = req.query.code;
    if (!code) {
      throw new Error('Code d\'autorisation manquant dans la requête.')
    }
    
    const requestBody = {
      grant_type: 'authorization_code',
      code: code,
      client_id: process.env.FORTY_TWO_UID,
      client_secret: process.env.FORTY_TWO_SECRET,
      redirect_uri: process.env.CALLBACK_URL,
    };
    // console.log("requestBody = ",requestBody);
    // console.log("code = ",code);
    return requestBody;
  }

  async getAccessToken(@Req() req): Promise<string> {
    try {
      const tokenUrl = process.env.FORTY_TWO_TOKEN_URL;
      // Effectuez la demande POST pour échanger le code contre un jeton
      const requestBody = await this.getRequestBody(req);
      const response = await axios.post(tokenUrl, requestBody);
      
      console.log("--------_RESPONSE--------= ",response.data);
      // L'API 42 renvoie un objet JSON contenant le jeton d'accès
      const accessToken = response.data.access_token;
      if (!accessToken) {
        throw new Error('Jetons d\'accès manquant dans la réponse de l\'API 42.')
      }
      return accessToken;
    }
    catch (error) {
      console.error('Erreur lors de l\'échange du code contre un jeton :', error);
    }
  }

  async getUsersFrom42(accessToken): Promise<any> {
    try {
      console.log("ACCESS",accessToken);
      const response = await lastValueFrom(
        this.httpService.get('https://api.intra.42.fr/v2/users', {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );
      const user = response;
      console.log(user);
      // return user;
    } catch (error) {
      console.error("Erreur lors de la demande à l'API 42:", error);
      throw error;
    }
  }
}
