import { Sequelize } from 'sequelize-typescript';

import { DEVELOPMENT, TEST, SEQUELIZE } from './database.constant';
const { User } = require('../../db/models/user');
const { DatabaseConfig } = require('./config');

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      let config;
      switch (process.env.NODE_ENV) {
        case DEVELOPMENT:
          config = DatabaseConfig.development;
          break;
        case TEST:
          config = DatabaseConfig.test;
          break;
        default:
          config = DatabaseConfig.development;
      }
      const sequelize = new Sequelize(config);
      sequelize.addModels([User]); // Vous devrez ajouter vos modèles ici
      (async () => {
        try {
          await sequelize.authenticate();
          console.log('Database connection setup successfully!');
        } catch (error) {
          console.log('Unable to connect to the database', error);
        }
      })();
      console.log(config);
      return sequelize;
    },
  },
];
