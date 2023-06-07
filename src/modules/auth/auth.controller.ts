import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UserDto } from '../users/dto/user.dto';
import { IsUserExists } from '../../core/guards/isUserExists.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Body() credentials) {
    console.log(credentials);
    return await this.authService.login(credentials);
  }

  @UseGuards(IsUserExists)
  @Post('signup')
  async signUp(@Body() user: UserDto) {
    return await this.authService.create(user);
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Get('refresh')
  async refresh(@Request() req) {
    const user = req.user;
    return await this.authService.refreshTokens({ id: user.id });
  }
}
