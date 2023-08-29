import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';
import { Sequelize } from 'sequelize';

@Module({
  providers: [...databaseProviders, Sequelize],
  exports: [...databaseProviders, Sequelize],
})
export class DatabaseModule {}
