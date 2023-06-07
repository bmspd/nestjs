import { Injectable, UnauthorizedException, Request } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH_TOKEN,
    });
  }
  async validate(payload: any) {
    const user = await this.userService.findOneById(payload.id);
    if (!user)
      throw new UnauthorizedException(
        'You are not authorized to perform the operation',
      );
    return payload;
  }
}
