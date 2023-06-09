import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Get,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UserDto } from '../users/dto/user.dto';
import { IsUserExists } from '../../core/guards/isUserExists.guard';
import { SignupPipe } from './signup.pipe';

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
  async signUp(@Body(SignupPipe) user: UserDto) {
    return await this.authService.create(user);
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
