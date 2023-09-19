import * as cookieSession from 'cookie-session';
import * as session from 'express-session';
import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { SwaggerTheme } from 'swagger-themes';
import { ValidationPipe } from '@nestjs/common';

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

  // Configuration du middleware express-session
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  );

  // app.set('trust proxy', 1); // trust first proxy for cookie-session mais pas sur que ce soit utile

  // Configuration du middleware cookie-session non utilisé pour l instant
  // app.use(
  //   cookieSession({
  //     name: 'session',
  //     keys: ['key1', 'key2'],

  //     // Cookie Options
  //     maxAge: 24 * 60 * 60 * 1000, // 24 hours
  //   }),
  // );

  // Configuration du middleware passport
  var passport = require('passport');
  app.use(passport.initialize());
  app.use(passport.session());

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3001);
}
bootstrap();
