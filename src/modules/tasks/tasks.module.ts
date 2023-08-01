import { Module } from '@nestjs/common';
import { ProjectsModule } from '../projects/projects.module';
import { UsersModule } from '../users/users.module';
import { TasksController } from './tasks.controller';
import { tasksProviders } from './tasks.provides';
import { TasksService } from './tasks.service';

@Module({
  controllers: [TasksController],
  providers: [TasksService, ...tasksProviders],
  exports: [TasksService, ...tasksProviders],
  imports: [ProjectsModule, UsersModule],
})
export class TasksModule {}
