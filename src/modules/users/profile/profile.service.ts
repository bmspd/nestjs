import { Inject, Injectable } from '@nestjs/common';
import { PROFILE_REPOSITORY } from '../../../core/constants';
import { Profile } from './profile.entity';
import { User } from '../user.entity';

@Injectable()
export class ProfileService {
  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: typeof Profile,
  ) {}

  async findOneById(id: number): Promise<Profile> {
    return await this.profileRepository.findOne({
      where: { id },
      include: { model: User, attributes: { exclude: ['password'] } },
    });
  }
}
