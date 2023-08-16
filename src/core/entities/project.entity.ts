import {
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyCountAssociationsMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyCountAssociationsMixin,
} from 'sequelize';
import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { Task } from './task.entity';
import { User } from './user.entity';

@Table
export class Project extends Model<Project> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  declare createTask: HasManyCreateAssociationMixin<Task>;
  declare getTasks: HasManyGetAssociationsMixin<Task>;
  declare countTasks: HasManyCountAssociationsMixin;
  declare getUsers: BelongsToManyGetAssociationsMixin<User>;
  declare countUsers: BelongsToManyCountAssociationsMixin;
}
