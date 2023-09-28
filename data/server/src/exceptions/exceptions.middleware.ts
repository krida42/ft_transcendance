import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { Response } from 'express';
import { InvalidTokenException, ExpiredTokenException } from './exceptions';

@Catch(InvalidTokenException, ExpiredTokenException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    if (exception instanceof InvalidTokenException || exception instanceof ExpiredTokenException) {
      response.redirect('http://localhost:8080/');
    } else {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error',
      });
    }
  }
}
