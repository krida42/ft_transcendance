import { Sequelize } from 'sequelize-typescript';

import { DEVELOPMENT, TEST, SEQUELIZE } from './database.constant';
// import { User } from 'models/user.model';
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
      // sequelize.addModels([User]); // Vous devrez ajouter vos modèles ici
      await sequelize.sync(); // Cela synchronisera les modèles avec la base de données
      console.log(config);
      return sequelize;
    },
  },
];
