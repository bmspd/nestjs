import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UsersService } from '../../modules/users/users.service';
import { Observable } from 'rxjs';
import { CustomForbiddenException } from '../exceptions/CustomForbiddenException';

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
    let userExists = await this.userService.findOneByEmail(request.body.email);
    if (userExists) {
      throw new CustomForbiddenException({
        email: 'This email already exists',
      });
    }
    if (request.body.username) {
      userExists = await this.userService.findOneByUsername(
        request.body.username,
      );
      if (userExists) {
        throw new CustomForbiddenException({
          username: 'This username already exists',
        });
      }
    }
    return true;
  }
}
