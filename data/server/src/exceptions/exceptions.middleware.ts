import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, Redirect } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { Response } from 'express';
import { InvalidTokenException, ExpiredTokenException } from './exceptions';

@Catch(InvalidTokenException, ExpiredTokenException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    if (exception instanceof InvalidTokenException || exception instanceof ExpiredTokenException) {
      console.log('Logout the user refresh token is invalid or expired');
      response.clearCookie('access_token');
      response.status(200).json({ message: 'Déconnexion réussie !' });
    } else {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error',
      });
    }
  }
}
