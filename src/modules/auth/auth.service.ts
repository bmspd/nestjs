import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private readonly logger = new Logger(AuthService.name);

  async validateUser(usernameOrEmail: string, pass: string) {
    const user = await this.userService.findOneByEmailOrUsername(
      usernameOrEmail,
    );
    if (!user) return null;
    const match = await this.comparePasswords(pass, user.password);
    if (!match) return null;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, profile, ...result } = user['dataValues'];
    return result;
  }

  public async login(user) {
    this.logger.log(`User [${user.username}]#${user.id} logging in`);
    const tokens = await this.generateTokens(user);
    this.logger.log(
      `User [${user.username}]#${user.id} successfully logged in`,
    );
    return { user, ...tokens };
  }

  public async loginByToken(user) {
    const userData = await this.userService.findOneByEmailOrUsername(
      user.email ?? user.username,
    );
    return userData;
  }
  public async loginByGoogle(user) {
    const userData = await this.userService.findOneByEmail(user.email);
    if (userData) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, username, password, ...rest } = userData['dataValues'];
      const tokens = await this.generateTokens({ id, username });
      return { id, username, ...rest, ...tokens };
    }
    // first_name и last_name могут оказаться меньше по длине!!!
    return await this.create({ ...user, password: 'RANDOM PASSWORD' });
  }
  public async create(user) {
    this.logger.log(`Creating new user [${user.username}]`);

    const pass = await this.hashPassword(user.password);
    const newUser = await this.userService.create({ ...user, password: pass });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = newUser['dataValues'];
    const tokens = await this.generateTokens({
      id: result.id,
      username: result.username,
    });

    return { user: result, ...tokens };
  }

  private async generateTokens(user) {
    this.logger.log(`Generating tokens for user [${user.username}]#${user.id}`);
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
    this.logger.log(`User [${user.username}]#${user.id} refreshing tokens`);
    const tokens = await this.generateTokens(user);
    this.logger.log(`User [${user.username}]#${user.id} refreshed tokens`);
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
