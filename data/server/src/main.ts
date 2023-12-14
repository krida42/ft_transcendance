import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { SwaggerTheme } from 'swagger-themes';
import { ValidationPipe } from '@nestjs/common';
import session from 'express-session';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import cookieParser from 'cookie-parser';
import { CustomExceptionFilter } from './exceptions/exceptions.middleware';
import { JwtAuthGuard } from './authentication/guards/jwt.guard';
import { Jwt2faAuthGuard } from './authentication/guards/2fa.guard';
import * as fs from 'fs';

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

  app.useGlobalGuards(app.get(JwtAuthGuard), app.get(Jwt2faAuthGuard));

  const document = SwaggerModule.createDocument(app, config);
  const theme = new SwaggerTheme('v3');
  const options = {
    explorer: true,
    customCss: theme.getBuffer('dark'),
  };
  SwaggerModule.setup('api', app, document, options);

  app.use(cookieParser());

  const corsOptions: CorsOptions = {
    origin: `${process.env.VUE_APP_CUICUI}:8080`,
    allowedHeaders:
      'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };
  app.enableCors(corsOptions);

  // Configuration du middleware express-session
  app.use(
    session({
      secret: process.env.SESSION_SECRET ?? '',
      resave: false,
      saveUninitialized: false,
    }),
  );

  // app.set('trust proxy', 1); // trust first proxy for cookie-session mais pas sur que ce soit utile

  // Configuration du middleware passport
  var passport = require('passport');
  app.use(passport.initialize());
  app.use(passport.session());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new CustomExceptionFilter());

  const dirPath = `/app/dist/public/`;
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath);

  const idx = dirPath + 'index.html';
  if (!fs.existsSync(idx)) fs.writeFileSync(idx, '');

  await app.listen(3001);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
