import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Get,
  UsePipes,
  UseInterceptors,
  ClassSerializerInterceptor,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UserDto } from '../users/dto/user.dto';
import { IsUserExists } from '../../core/guards/isUserExists.guard';
import { SignupPipe } from './signup.pipe';
import { CreateUserDto } from '../users/dto/createUser.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req, @Body() credentials) {
    return await this.authService.login(req.user);
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
