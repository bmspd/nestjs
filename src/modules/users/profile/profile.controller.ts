import { Controller, Get, UseGuards, Request, Param } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getProfileByUsername(@Request() req) {
    return this.profileService.findOneById(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/email-verify')
  async verifyEmail(@Request() req) {
    return this.profileService.sendEmailWithVerificationLink(req.user.id);
  }
  @Get('/email-verify/:hash')
  async checkVerificationLink(@Param('hash') hash) {
    return this.profileService.checkVerificationLink(hash);
  }
}
