import { PROJECT_REPOSITORY } from 'src/core/constants';
import { Project } from '../../core/entities/project.entity';

export const projectProviders = [
  {
    provide: PROJECT_REPOSITORY,
    useValue: Project,
  },
];
