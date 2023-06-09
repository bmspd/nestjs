import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWTKEY,
    });
  }
  // payload - то, что было записано в jwt-token
  async validate(payload: any) {
    const user = await this.userService.findOneById(payload.id);
    if (!user)
      throw new UnauthorizedException(
        'You are not authorized to perform the operation',
      );
    return payload;
  }
}
