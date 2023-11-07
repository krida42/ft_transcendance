import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { SwaggerTheme } from 'swagger-themes';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import * as cookieParser from 'cookie-parser';
import { CustomExceptionFilter } from './exceptions/exceptions.middleware';
import { LocalPresence, RedisPresence, Server, matchMaker } from 'colyseus';
import { PongRoom } from './game/server/room';
import { createServer } from 'http';
import * as http from 'http';
import * as colyseus from 'colyseus';

async function bootstrap() {  
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const config = new DocumentBuilder()
    .setTitle('ft_transcendence API')
    .setDescription(
      'A multiplayer Pong game with a chat and a tournament system',
    )
    .setVersion('1.0')
    // .addBearerAuth() authentification token for swagger use with ApiBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const theme = new SwaggerTheme('v3');
  const options = {
    explorer: true,
    customCss: theme.getBuffer('dark'),
  };
  SwaggerModule.setup('api', app, document, options);

  app.use(cookieParser());

  const corsOptions: CorsOptions = {
    origin: 'http://localhost:8080',
    allowedHeaders:
      'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };
  app.enableCors(corsOptions);

  // Configuration du middleware express-session
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  );
  
  //serverGame

  // matchMaker.controller.getCorsHeaders = function(req) {
  //   return {
  //     'Access-Control-Allow-Origin': req.headers.origin,
  //     'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
  //     'Access-Control-Allow-Credentials': 'true'
  //   }
  // }
  const gameServer = new colyseus.Server({
    // presence: new LocalPresence(), 
    server: http.createServer(app.getHttpAdapter().getInstance()),
  });
  gameServer.define('pong', PongRoom);
  
  // app.set('trust proxy', 1); // trust first proxy for cookie-session mais pas sur que ce soit utile
  
  // Configuration du middleware passport
  var passport = require('passport');
  app.use(passport.initialize());
  app.use(passport.session());
  
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new CustomExceptionFilter());
  
  await app.listen(3001);
  gameServer.listen(2567);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
