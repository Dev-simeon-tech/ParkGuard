import { EmailService } from '../email.service';
import { InviteEmail, ResetPasswordEmail, VerificationEmail } from '../templates';
import { EmailNotificationType, NotificationChannel } from '../types';
import type { EmailNotificationPayload, NotificationStrategy } from '../types';

export class EmailNotificationStrategy implements NotificationStrategy<EmailNotificationPayload> {
  readonly channel = NotificationChannel.EMAIL;
  private readonly emailService = new EmailService();

  async dispatch(payload: EmailNotificationPayload): Promise<void> {
    switch (payload.type) {
      case EmailNotificationType.VERIFICATION:
        await this.emailService.sendEmail({
          to: payload.email,
          subject: 'Verify your ParkGuard email',
          template: VerificationEmail({ verificationUrl: payload.verificationUrl }),
        });
        return;
      case EmailNotificationType.INVITE:
        await this.emailService.sendEmail({
          to: payload.email,
          subject: `You've been invited to join ${payload.organizationName} on ParkGuard`,
          template: InviteEmail({
            organizationName: payload.organizationName,
            inviteUrl: payload.inviteUrl,
          }),
        });
        return;
      case EmailNotificationType.PASSWORD_RESET:
        await this.emailService.sendEmail({
          to: payload.email,
          subject: 'Reset your ParkGuard password',
          template: ResetPasswordEmail({ resetUrl: payload.resetUrl }),
        });
        return;
    }
  }
}
