import { Inject, Injectable } from '@nestjs/common';
import { PROFILE_REPOSITORY, USER_REPOSITORY } from '../../core/constants';
import { User } from './user.entity';
import { UserDto } from './dto/user.dto';
import { Op } from 'sequelize';
import { Profile } from './profile/profile.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: typeof Profile,
  ) {}

  async create(user: UserDto): Promise<User> {
    const newUser = await this.userRepository.create<User>(user);
    await this.profileRepository.create<Profile>({ user_id: newUser.id });
    return newUser;
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne<User>({ where: { email } });
  }

  async findOneById(id: number): Promise<User> {
    return await this.userRepository.findOne<User>({
      where: { id },
      include: { model: Profile },
    });
  }

  async findOneByUsername(username: string): Promise<User> {
    return await this.userRepository.findOne<User>({ where: { username } });
  }

  async findOneByEmailOrUsername(value: string): Promise<User> {
    return await this.userRepository.findOne<User>({
      where: { [Op.or]: [{ email: value }, { username: value }] },
    });
  }
  async countAll(): Promise<number> {
    return await this.userRepository.count();
  }
}
