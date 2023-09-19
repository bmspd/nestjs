import { DataTypes } from 'sequelize';
import { Table, Model, Column } from 'sequelize-typescript';
import { Project } from './project.entity';
import { Image } from './image.entity';
@Table
export class ImageTask extends Model<ImageTask> {
  @Column({
    type: DataTypes.INTEGER,
    references: {
      model: Project,
    },
  })
  task_id: number;

  @Column({
    type: DataTypes.INTEGER,
    references: {
      model: Image,
    },
  })
  image_id: number;
}
