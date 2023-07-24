import { Column, DataType, HasOne, Model, Table } from 'sequelize-typescript';
import { Profile } from './profile/profile.entity';

@Table
export class User extends Model<User> {
  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: 'username',
  })
  username: string;

  @Column({
    type: DataType.STRING,
    unique: 'email',
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @HasOne(() => Profile)
  profile: Profile;
}
