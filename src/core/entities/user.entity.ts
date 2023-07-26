import {
  BelongsToManyAddAssociationMixin,
  BelongsToManySetAssociationsMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyHasAssociationMixin,
  BelongsToManyRemoveAssociationMixin,
  BelongsToManyCountAssociationsMixin,
  BelongsToManyCreateAssociationMixin,
  HasOneGetAssociationMixin,
  HasOneCreateAssociationMixin,
} from 'sequelize';
import { Column, DataType, HasOne, Model, Table } from 'sequelize-typescript';
import { Project } from './project.entity';
import { Profile } from './profile.entity';

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

  @HasOne(() => Profile, { onDelete: 'CASCADE' })
  profile: Profile;

  declare getProfile: HasOneGetAssociationMixin<Profile>;
  declare createProfile: HasOneCreateAssociationMixin<Profile>;

  declare addProject: BelongsToManyAddAssociationMixin<Project, number>;
  declare addProjects: BelongsToManyAddAssociationMixin<Project, number>;
  declare setProjects: BelongsToManySetAssociationsMixin<Project, number>;
  declare getProjects: BelongsToManyGetAssociationsMixin<Project>;
  declare removeProject: BelongsToManyRemoveAssociationMixin<Project, number>;
  declare removeProjects: BelongsToManyRemoveAssociationMixin<Project, number>;
  declare hasProject: BelongsToManyHasAssociationMixin<Project, number>;
  declare hasProjects: BelongsToManyHasAssociationMixin<Project, number>;
  declare countProjects: BelongsToManyCountAssociationsMixin;
  declare createProject: BelongsToManyCreateAssociationMixin<Project>;
}
