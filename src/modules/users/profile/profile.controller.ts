import {
  Controller,
  Get,
  UseGuards,
  Request,
  Param,
  Patch,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { AuthGuard } from '@nestjs/passport';
import { Body } from '@nestjs/common/decorators/http/route-params.decorator';
import { CreateUpdateProfileDto } from '../dto/profile.dto';
import { UseInterceptors } from '@nestjs/common/decorators/core/use-interceptors.decorator';
import { TrimTransformInterceptor } from 'src/core/interceptors/trim.interceptor';

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

  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(new TrimTransformInterceptor())
  @Patch()
  async updateProfile(@Request() req, @Body() profile: CreateUpdateProfileDto) {
    await this.profileService.updateProfile(req.user.id, profile);
    return {
      message: 'Profile successfully updated',
    };
  }
}
