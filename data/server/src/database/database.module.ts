import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers'; // Assurez-vous que le chemin d'importation est correct
import { Sequelize } from 'sequelize';

@Module({
  providers: [...databaseProviders, Sequelize],
  exports: [...databaseProviders, Sequelize],
})
export class DatabaseModule {}
