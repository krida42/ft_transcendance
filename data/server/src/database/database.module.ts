import { Module } from '@nestjs/common';
// import { databaseProviders } from './database.providers';
import { Sequelize } from 'sequelize';

@Module({
  providers: [Sequelize],
  exports: [Sequelize],
})
export class DatabaseModule {}
