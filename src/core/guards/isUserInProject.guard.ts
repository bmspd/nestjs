import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from 'src/modules/users/users.service';
import { CustomNotFoundException } from '../exceptions/CustomNotFoundException';
@Injectable()
export class IsUserInProject implements CanActivate {
  constructor(private readonly userService: UsersService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  async validateRequest(request) {
    /* Don't like this cast*/
    const projectId = +request.params.projectId;
    const userId = request.user.id;
    const isUserInProject = await this.userService.isUserInProject(
      userId,
      projectId,
    );
    if (!isUserInProject)
      throw new CustomNotFoundException({
        user: 'This user does not belongs to project',
      });
    return true;
  }
}
