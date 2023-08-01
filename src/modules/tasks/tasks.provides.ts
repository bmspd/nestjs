import { TASK_REPOSITORY } from 'src/core/constants';
import { Task } from 'src/core/entities/task.entity';

export const tasksProviders = [
  {
    provide: TASK_REPOSITORY,
    useValue: Task,
  },
];
