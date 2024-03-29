import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Get,
  Logger,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { IsUserExists } from '../../core/guards/isUserExists.guard';
import { SignupPipe } from './signup.pipe';
import { CreateUserDto } from '../users/dto/createUser.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  private readonly logger = new Logger(AuthController.name);
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return await this.authService.login(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('login')
  async loginByToken(@Request() req) {
    this.logger.log(`#${req.user.id} logging by token`);
    return await this.authService.loginByToken(req.user);
  }
  @UseGuards()
  @Post('login/google')
  async loginByGoogle(@Body(SignupPipe) credentials) {
    return await this.authService.loginByGoogle(credentials);
  }
  @UseGuards(IsUserExists)
  @Post('signup')
  async signUp(@Body(SignupPipe) user: CreateUserDto) {
    const newUser = await this.authService.create(user);
    return {
      message: `User with ${newUser.user.email} email was successfully registered`,
    };
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Get('refresh')
  async refresh(@Request() req) {
    const user = req.user;
    return await this.authService.refreshTokens({
      id: user.id,
      username: user.username,
    });
  }
}
