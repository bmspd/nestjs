import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getProfileByUsername(@Request() req) {
    console.log(req.user);
    return this.profileService.findOneById(req.user.id);
  }
}
