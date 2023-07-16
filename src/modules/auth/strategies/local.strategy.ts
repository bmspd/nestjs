import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { CustomBadRequestExceptions } from '../../../core/exceptions/CustomBadRequestExceptions';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(usernameOrEmail: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(usernameOrEmail, password);
    if (!user)
      throw new CustomBadRequestExceptions({
        'server-error': 'Invalid user credentials',
      });
    return user;
  }
}
