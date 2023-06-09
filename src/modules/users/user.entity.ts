import { Column, DataType, HasOne, Model, Table } from 'sequelize-typescript';
import { Profile } from './profile/profile.entity';

@Table
export class User extends Model<User> {
  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  username: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  nickname: string;

  @HasOne(() => Profile)
  profile: Profile;
}
