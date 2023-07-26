import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { ProjectsController } from './projects.controller';
import { projectProviders } from './projects.provider';
import { ProjectsService } from './projects.service';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService, ...projectProviders],
  exports: [ProjectsService, ...projectProviders],
  imports: [UsersModule],
})
export class ProjectsModule {}
