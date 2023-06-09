import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { profileProviders } from './profile.providers';

@Module({
  providers: [ProfileService, ...profileProviders],
  exports: [ProfileService, ...profileProviders],
  controllers: [ProfileController],
})
export class ProfileModule {}
