import { Column, DataType, Model, Table, HasOne } from 'sequelize-typescript';
import { Project } from './project.entity';
@Table
export class Image extends Model<Image> {
  @Column({
    type: DataType.STRING,
  })
  original_name: string;

  @Column({
    type: DataType.STRING,
  })
  mimetype: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  path: string;

  @HasOne(() => Project)
  logo: Image;
}
