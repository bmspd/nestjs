import { Controller, Get } from '@nestjs/common';
import { MailingService } from './mailing.service';

@Controller('mailing')
export class MailingController {
  constructor(private mailingService: MailingService) {}

  @Get('send-mail')
  public async sendMail() {
    return this.mailingService.sendMail({
      to: ['bmspd.test@gmail.com', 'my_spid1@mail.ru'],
      context: {
        code: '322322',
        clickLink: 'https://github.com/bmspd',
        username: 'bmspd',
      },
      subject: 'Test Email Verification',
      template: 'email-verification',
    });
  }
}
