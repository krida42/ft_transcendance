import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost', //localhost pour local ou postgres pour docker
      port: 5432,
      username: 'postgres',
      password: 'mdp',
      database: 'database_development',
      synchronize: true,
      autoLoadModels: true,
      logging: false,
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [SequelizeModule], // pour que les autres modules puissent utiliser SequelizeModule
})
export class AppModule {}
