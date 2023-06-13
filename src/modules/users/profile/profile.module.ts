import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { profileProviders } from './profile.providers';
import { MailingModule } from '../../mailing/mailing.module';

@Module({
  providers: [ProfileService, ...profileProviders],
  exports: [ProfileService, ...profileProviders],
  controllers: [ProfileController],
  imports: [MailingModule],
})
export class ProfileModule {}
