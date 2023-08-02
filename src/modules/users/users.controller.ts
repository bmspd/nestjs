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
import { CreateUserPassDto, UpdateUserPassDto } from './dto/user.dto';

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
    return this.usersService.createPassword(req.user.id, body.password);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('password')
  async changePassword(@Request() req, @Body() body: UpdateUserPassDto) {
    return this.usersService.changePassword(
      req.user.id,
      body.password,
      body.new_password,
    );
  }
}
