import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(username: string, pass: string) {
    const user = await this.userService.findOneByEmail(username);
    if (!user) return null;
    const match = await this.comparePasswords(pass, user.password);
    if (!match) return null;

    const { password, ...result } = user['dataValues'];
    return result;
  }
  public async login(user) {
    const tokens = await this.generateTokens(user);
    return { user, ...tokens };
  }
  public async create(user) {
    const pass = await this.hashPassword(user.password);
    const newUser = await this.userService.create({ ...user, password: pass });

    const { password, ...result } = newUser['dataValues'];

    const tokens = await this.generateTokens({ id: result.id });

    return { user: result, ...tokens };
  }
  private async generateTokens(user) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(user),
      this.jwtService.signAsync(user, {
        secret: process.env.JWT_REFRESH_TOKEN,
        expiresIn: process.env.TOKEN_REFRESH_EXPIRATION,
      }),
    ]);
    return { accessToken, refreshToken };
  }
  public async refreshTokens(user) {
    const tokens = await this.generateTokens(user);
    return { ...tokens };
  }
  private async hashPassword(password) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }
  private async comparePasswords(enteredPassword, dbPassword) {
    const match = await bcrypt.compare(enteredPassword, dbPassword);
    return match;
  }
}
