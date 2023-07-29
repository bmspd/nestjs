import { Controller, Delete, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ProfileService } from './profile/profile.service';
import { AuthGuard } from '@nestjs/passport';

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
}
