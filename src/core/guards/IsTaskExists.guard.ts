import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TasksService } from 'src/modules/tasks/tasks.service';
import { CustomNotFoundException } from '../exceptions/CustomNotFoundException';
@Injectable()
export class IsTaskExists implements CanActivate {
  constructor(private readonly taskService: TasksService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  async validateRequest(request) {
    const taskId = request.params.taskId;
    const task = await this.taskService.getTaskById(taskId);
    if (!task) {
      throw new CustomNotFoundException({ task: 'Task not found' });
    }
    return true;
  }
}
