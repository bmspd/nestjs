import {
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
} from 'sequelize';
import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import {
  TASK_DEFAULT_PRIORITY,
  TASK_DEFAULT_STATUS,
  TASK_PRIORITIES,
  TASK_STATUSES,
} from '../constants/task';
import { Project } from './project.entity';
import { User } from './user.entity';

@Table
export class Task extends Model<Task> {
  @ForeignKey(() => Project)
  project_id: number;
  @ForeignKey(() => User)
  executor_id: number;
  @ForeignKey(() => User)
  creator_id: number;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: [...Object.values(TASK_STATUSES)],
    defaultValue: TASK_DEFAULT_STATUS,
  })
  status: TASK_STATUSES;

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: [...Object.values(TASK_PRIORITIES)],
    defaultValue: TASK_DEFAULT_PRIORITY,
  })
  priority: TASK_PRIORITIES;

  declare getExecutor: BelongsToGetAssociationMixin<User>;
  declare setExecutor: BelongsToSetAssociationMixin<User, number>;

  declare getCreator: BelongsToGetAssociationMixin<User>;
  declare setCreator: BelongsToSetAssociationMixin<User, number>;
}
