import { Column, Model, Sequelize, Table } from 'sequelize-typescript';
import { SEQUELIZE, DEVELOPMENT, TEST, PRODUCTION } from '../constants';
import { databaseConfig } from './database.config';
import { User } from '../../modules/users/user.entity';
import { Profile } from '../../modules/users/profile/profile.entity';
import { Project } from 'src/modules/projects/project.entity';
import { DataTypes } from 'sequelize';

@Table
export class UserProject extends Model<UserProject> {
  @Column({
    type: DataTypes.INTEGER,
    references: {
      model: Project,
      key: 'id',
    },
  })
  project_id: number;

  @Column({
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
  })
  user_id: number;
}

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
      sequelize.addModels([User, Profile, Project, UserProject]);
      User.hasOne(Profile, { foreignKey: 'user_id' });
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
      await sequelize.sync();
      return sequelize;
    },
  },
];
