import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import { DEVELOPMENT, TEST, PRODUCTION, SEQUELIZE } from './database.constant';
import { User } from 'models/user.model';
const { databaseConfig } = require('./config');

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      let config: SequelizeOptions;
      switch (process.env.NODE_ENV) {
        case DEVELOPMENT:
          config = databaseConfig.development;
          break;
        case TEST:
          config = databaseConfig.test;
          break;
        default:
          config = databaseConfig.development;
      }
      console.log(config);
      console.log(process.env.LOGNAME);
      const sequelize = new Sequelize(config);
      sequelize.addModels([User]); // Vous devrez ajouter vos modèles ici
      await sequelize.sync(); // Cela synchronisera les modèles avec la base de données
      return sequelize;
    },
  },
];
