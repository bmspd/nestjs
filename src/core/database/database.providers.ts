import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE, DEVELOPMENT, TEST, PRODUCTION } from '../constants';
import { databaseConfig } from './database.config';
import { User } from '../../modules/users/user.entity';
import { Profile } from '../../modules/users/profile/profile.entity';
import { Project } from 'src/modules/projects/project.entity';

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      let config;
      switch (process.env.NODE_ENV) {
        case DEVELOPMENT:
          config = databaseConfig.development;
          break;
        case TEST:
          config = databaseConfig.test;
          break;
        case PRODUCTION:
          config = databaseConfig.production;
          break;
        default:
          config = databaseConfig.development;
      }
      const sequelize = new Sequelize(config);
      sequelize.addModels([User, Profile, Project]);
      User.hasOne(Profile, { foreignKey: 'user_id' });
      Profile.belongsTo(User, { foreignKey: 'user_id' });
      User.belongsToMany(Project, { through: 'User_Project' });
      Project.belongsToMany(User, { through: 'User_Project' });
      await sequelize.sync();
      return sequelize;
    },
  },
];
