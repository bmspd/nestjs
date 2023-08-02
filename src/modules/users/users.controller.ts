import {
  Controller,
  Delete,
  Post,
  Body,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ProfileService } from './profile/profile.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserPassDto } from './dto/user.dto';

@Controller()
export class UsersController {
  constructor(
    private usersService: UsersService,
    private profileService: ProfileService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Delete()
  async deleteYourself(@Request() req) {
    await this.usersService.deleteUser(req.user.id);
    return {
      message: 'User successfully deleted',
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('password')
  async createPassword(@Request() req, @Body() body: CreateUserPassDto) {
    console.log(body);
    console.log(req.user);
    return this.usersService.createPassword(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('password')
  async updatePassword(@Request() req) {
    console.log(req);
    return 'bye';
  }
}
