import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ProjectsService } from 'src/modules/projects/projects.service';
import { CustomNotFoundException } from '../exceptions/CustomNotFoundException';
@Injectable()
export class IsProjectExists implements CanActivate {
  constructor(private readonly projectService: ProjectsService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  async validateRequest(request) {
    const projectId = request.params.projectId;
    const project = await this.projectService.getProjectById(projectId);
    if (!project) {
      throw new CustomNotFoundException({ project: 'Project not found' });
    }
    return true;
  }
}
