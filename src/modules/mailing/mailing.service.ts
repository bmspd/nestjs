import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import { Options } from 'nodemailer/lib/smtp-transport';
import { SendMail } from './mailing.interfaces';

@Injectable()
export class MailingService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  private readonly logger = new Logger(MailerService.name);

  private async setTransport() {
    const OAuth2 = google.auth.OAuth2;
    const oauth2Client = new OAuth2(
      this.configService.get('SMTP_CLIENT_ID'),
      this.configService.get('SMTP_CLIENT_SECRET'),
      'https://developers.google.com/oauthplayground',
    );
    oauth2Client.setCredentials({
      refresh_token: process.env.SMTP_REFRESH_TOKEN,
    });
    const accessToken: string = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          reject('Failed to create access token');
          this.logger.log('Failed to create access token');
        }
        resolve(token);
      });
    });

    const config: Options = {
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: this.configService.get('SMTP_EMAIL'),
        clientId: this.configService.get('SMTP_CLIENT_ID'),
        clientSecret: this.configService.get('SMTP_CLIENT_SECRET'),
        accessToken,
      },
    };
    this.mailerService.addTransporter('gmail', config);
  }

  public async sendMail({
    to,
    subject,
    template,
    context,
    attachments,
  }: SendMail) {
    await this.setTransport();
    this.mailerService
      .sendMail({
        transporterName: 'gmail',
        to,
        from: process.env.SMTP_EMAIL,
        subject,
        template,
        context,
        attachments,
      })
      .then((success) => {
        this.logger.log(`Message sent to: ${success.accepted.toString()}`);
      })
      .catch((err) => {
        this.logger.error(err.toString());
      });
  }
}
