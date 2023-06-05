import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../../modules/users/users.service';
import { Observable } from 'rxjs';

@Injectable()
export class IsUserExists implements CanActivate {
  constructor(private readonly userService: UsersService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }
  async validateRequest(request) {
    const userExists = await this.userService.findOneByEmail(
      request.body.email,
    );
    if (userExists) {
      throw new ForbiddenException('This email already exists');
    }
    return true;
  }
}
