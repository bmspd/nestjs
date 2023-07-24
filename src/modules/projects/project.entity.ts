import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table
export class Project extends Model<Project> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: 'name',
  })
  name: string;
}
