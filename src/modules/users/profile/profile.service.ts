import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PROFILE_REPOSITORY } from '../../../core/constants';
import { Profile } from './profile.entity';
import { User } from '../user.entity';
import * as bcrypt from 'bcrypt';
import { MailingService } from '../../mailing/mailing.service';
import { app } from '../../../main';

@Injectable()
export class ProfileService {
  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: typeof Profile,
    @Inject(MailingService)
    private readonly mailingService: MailingService,
  ) {}

  async checkVerificationLink(hash: string): Promise<{ message: string }> {
    const profile = await this.findOneByLinkHash(hash);
    if (!profile) throw new BadRequestException();
    profile.verify_link = null;
    profile.email_verified = true;
    await profile.save();
    return { message: 'Email successfully verified' };
  }

  async findOneById(id: number): Promise<Profile> {
    return await this.profileRepository.findOne({
      where: { id },
      attributes: { exclude: ['user_id'] },
      include: { model: User, attributes: { exclude: ['password'] } },
    });
  }
  async findOneByLinkHash(hash: string): Promise<Profile> {
    return await this.profileRepository.findOne({
      where: { verify_link: hash },
    });
  }
  async sendEmailWithVerificationLink(id: number): Promise<any> {
    const hash = await bcrypt.hash(process.env.EMAIL_VERIFICATION_SECRET, 10);
    const profile = await this.profileRepository.findOne({
      where: { user_id: id },
      include: { model: User },
    });
    profile.verify_link = hash;
    await profile.save();
    const encodedHash = encodeURIComponent(hash);
    const url = await app.getUrl();
    await this.mailingService.sendMail({
      to: ['bmspd.test@gmail.com'],
      context: {
        clickLink: `${url}/api/user/profile/email-verify/${encodedHash}`,
        username: 'bmspd',
      },
      subject: 'Test Email Verification',
      template: 'email-verification',
    });
    return {
      message: `Email with verification link sent to ${profile.user.email}`,
    };
  }
}
