import { DataTypes } from 'sequelize';
import { Table, Model, Column } from 'sequelize-typescript';
import { Project } from 'src/core/entities/project.entity';
import { User } from './user.entity';

@Table
export class UserProject extends Model<UserProject> {
  @Column({
    type: DataTypes.INTEGER,
    references: {
      model: Project,
    },
  })
  project_id: number;

  @Column({
    type: DataTypes.INTEGER,
    references: {
      model: User,
    },
  })
  user_id: number;
}
