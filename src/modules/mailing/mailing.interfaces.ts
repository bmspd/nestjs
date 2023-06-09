import { Address } from '@nestjs-modules/mailer/dist/interfaces/send-mail-options.interface';

export type SendMail = {
  to: string | Address | (string | Address)[];
  subject: string;
  template: string;
  context?: { [p: string]: any };
  attachments?: any;
};
