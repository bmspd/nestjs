import {
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyCountAssociationsMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyCountAssociationsMixin,
  BelongsToCreateAssociationMixin,
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

@Table
export class Project extends Model<Project> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @ForeignKey(() => Image)
  logo_id: number;

  declare createTask: HasManyCreateAssociationMixin<Task>;
  declare getTasks: HasManyGetAssociationsMixin<Task>;
  declare countTasks: HasManyCountAssociationsMixin;
  declare getUsers: BelongsToManyGetAssociationsMixin<User>;
  declare countUsers: BelongsToManyCountAssociationsMixin;
  declare createLogo: BelongsToCreateAssociationMixin<Image>;
  declare getLogo: BelongsToCreateAssociationMixin<Image>;
}
