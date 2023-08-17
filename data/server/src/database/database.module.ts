import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers'; // Assurez-vous que le chemin d'importation est correct

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
