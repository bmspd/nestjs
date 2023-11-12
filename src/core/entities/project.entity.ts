import {
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyCountAssociationsMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyCountAssociationsMixin,
  BelongsToCreateAssociationMixin,
  BelongsToSetAssociationMixin,
  BelongsToManyAddAssociationMixin,
} from 'sequelize';
import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
} from 'sequelize-typescript';
import { Task } from './task.entity';
import { User } from './user.entity';
import { Image } from './image.entity';
import {
  PROJECT_PATTERN_COLORS,
  PROJECT_PATTERN_TYPES,
} from '../constants/project';

@Table
export class Project extends Model<Project> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @ForeignKey(() => Image)
  logo_id: number;

  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: [...Object.values(PROJECT_PATTERN_TYPES)],
  })
  pattern_type: PROJECT_PATTERN_TYPES;

  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: [...Object.values(PROJECT_PATTERN_COLORS)],
  })
  pattern_color: PROJECT_PATTERN_COLORS;

  declare createTask: HasManyCreateAssociationMixin<Task>;
  declare getTasks: HasManyGetAssociationsMixin<Task>;
  declare countTasks: HasManyCountAssociationsMixin;
  declare getUsers: BelongsToManyGetAssociationsMixin<User>;
  declare addUser: BelongsToManyAddAssociationMixin<User, number>;
  declare countUsers: BelongsToManyCountAssociationsMixin;
  declare createLogo: BelongsToCreateAssociationMixin<Image>;
  declare getLogo: BelongsToCreateAssociationMixin<Image>;
  declare setLogo: BelongsToSetAssociationMixin<Image, number>;
}
