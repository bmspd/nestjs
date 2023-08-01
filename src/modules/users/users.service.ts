import { Inject, Injectable } from '@nestjs/common';
import { PROFILE_REPOSITORY, USER_REPOSITORY } from '../../core/constants';
import { User } from '../../core/entities/user.entity';
import { Op } from 'sequelize';
import { Profile } from '../../core/entities/profile.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { CustomNotFoundException } from 'src/core/exceptions/CustomNotFoundException';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: typeof Profile,
  ) {}

  async create(user: CreateUserDto): Promise<User> {
    const newUser = await this.userRepository.create<User>(user);
    await this.profileRepository.create<Profile>({
      user_id: newUser.id,
      ...user,
    });
    return newUser;
  }
  async deleteUser(userId: number, force = false): Promise<void> {
    const dbUser = await this.userRepository.findByPk(userId, {
      paranoid: !force,
    });
    await dbUser.destroy({ force });
  }
  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne<User>({ where: { email } });
  }

  async findOneById(id: number): Promise<User> {
    return await this.userRepository.findOne<User>({
      where: { id },
      include: {
        model: Profile,
        attributes: { exclude: ['verify_link', 'id', 'user_id'] },
      },
    });
  }

  async findOneByUsername(username: string): Promise<User> {
    return await this.userRepository.findOne<User>({ where: { username } });
  }

  async findOneByEmailOrUsername(value: string): Promise<User> {
    return await this.userRepository.findOne<User>({
      where: { [Op.or]: [{ email: value }, { username: value }] },
      include: {
        model: Profile,
        attributes: { exclude: ['verify_link', 'id', 'user_id'] },
      },
    });
  }

  async countAll(): Promise<number> {
    return await this.userRepository.count();
  }

  async isUserInProject(userId: number, projectId: number): Promise<boolean> {
    const user = await this.findOneById(userId);
    if (!user) throw new CustomNotFoundException({ user: 'User not found' });
    return user.hasProject(projectId);
  }
}
