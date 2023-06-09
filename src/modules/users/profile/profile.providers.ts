import { PROFILE_REPOSITORY } from '../../../core/constants';
import { Profile } from './profile.entity';

export const profileProviders = [
  {
    provide: PROFILE_REPOSITORY,
    useValue: Profile,
  },
];
