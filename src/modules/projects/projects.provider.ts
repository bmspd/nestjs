import { PROFILE_REPOSITORY } from 'src/core/constants';
import { Project } from './project.entity';

export const projectProviders = [
  {
    provide: PROFILE_REPOSITORY,
    useValue: Project,
  },
];
