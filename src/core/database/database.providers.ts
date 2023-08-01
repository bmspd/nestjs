import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE, DEVELOPMENT, TEST, PRODUCTION } from '../constants';
import { databaseConfig } from './database.config';
import { User } from '../entities/user.entity';
import { Profile } from '../entities/profile.entity';
import { Project } from 'src/core/entities/project.entity';
import { UserProject } from 'src/core/entities/userProject.entity';
import { Task } from '../entities/task.entity';

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
      sequelize.addModels([User, Profile, Project, UserProject, Task]);
      User.hasOne(Profile, { foreignKey: 'user_id', onDelete: 'CASCADE' });
      Profile.belongsTo(User, { foreignKey: 'user_id' });
      User.belongsToMany(Project, {
        through: UserProject,
        foreignKey: 'user_id',
        otherKey: 'project_id',
      });
      Project.belongsToMany(User, {
        through: UserProject,
        foreignKey: 'project_id',
        otherKey: 'user_id',
      });
      Project.hasMany(Task, { foreignKey: 'project_id' });
      Task.belongsTo(Project, { foreignKey: 'project_id' });
      User.hasMany(Task, { foreignKey: 'executor_id', as: 'executingTasks' });
      Task.belongsTo(User, { foreignKey: 'executor_id', as: 'executor' });
      User.hasMany(Task, { foreignKey: 'executor_id', as: 'createdTasks' });
      Task.belongsTo(User, { foreignKey: 'creator_id', as: 'creator' });
      const needAlter = false;
      await sequelize.sync({ alter: needAlter });
      return sequelize;
    },
  },
];
