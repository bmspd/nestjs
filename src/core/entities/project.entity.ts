import {
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
} from 'sequelize';
import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { Task } from './task.entity';

@Table
export class Project extends Model<Project> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  declare createTask: HasManyCreateAssociationMixin<Task>;
  declare getTasks: HasManyGetAssociationsMixin<Task>;
}
