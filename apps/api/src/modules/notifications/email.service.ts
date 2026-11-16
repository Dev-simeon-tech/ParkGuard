import type { ReactElement } from 'react';
import { Resend } from 'resend';
import { Logger } from '@/common/utils/logger';
import { envConfig } from '@/config';

type SendEmailOptions = {
  to: string;
  subject: string;
  template: ReactElement;
};

export class EmailService {
  private readonly resend = new Resend(envConfig.email.resendApiKey);
  private readonly logger = new Logger(EmailService.name);

  async sendEmail(options: SendEmailOptions): Promise<void> {
    try {
      const { error } = await this.resend.emails.send({
        from: envConfig.email.from,
        to: options.to,
        subject: options.subject,
        react: options.template,
      });
      if (error) {
        this.logger.error(`Failed to send email to ${options.to}`, error);
      }
    } catch (error) {
      this.logger.error(`Failed to send email to ${options.to}`, error);
    }
  }
}
