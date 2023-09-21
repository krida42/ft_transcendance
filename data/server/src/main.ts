import * as cookieSession from 'cookie-session';
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

  // Configuration du middleware cors
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080'); // Update this to match the origin site you're making the request from
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept',
    );
    res.header('Access-Control-Allow-Credentials', 'true'); // Ajoutez cette ligne
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Add this line
    next();
  });
  //OU
  // const corsOptions: CorsOptions = {
  //   origin: 'http://localhost:8080', // Remplacez par l'URL de votre front-end
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //   credentials: true, // Permet d'inclure les cookies dans la requête (si nécessaire)
  // };
  // app.enableCors(corsOptions);

  // Configuration du middleware express-session
  // app.use(
  //   session({
  //     secret: process.env.SESSION_SECRET,
  //     resave: false,
  //     saveUninitialized: false,
  //   }),
  // );

  // app.set('trust proxy', 1); // trust first proxy for cookie-session mais pas sur que ce soit utile

  // Configuration du middleware cookie-session non utilisé pour l instant
  app.use(
    cookieSession({
      name: 'session',
      keys: ['key1', 'key2'],

      // Cookie Options
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    }),
  );

  // Configuration du middleware passport
  var passport = require('passport');
  app.use(passport.initialize());
  app.use(passport.session());

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3001);
}
bootstrap();
