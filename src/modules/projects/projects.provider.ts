import { PROJECT_REPOSITORY } from 'src/core/constants';
import { Project } from './project.entity';

export const projectProviders = [
  {
    provide: PROJECT_REPOSITORY,
    useValue: Project,
  },
];
