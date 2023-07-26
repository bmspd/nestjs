import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from './user.entity';

@Table
export class Profile extends Model<Profile> {
  @ForeignKey(() => User)
  user_id: number;
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  email_verified: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: 'verify_link',
  })
  verify_link: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  first_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  second_name: string;

  @BelongsTo(() => User)
  user: User;
}
