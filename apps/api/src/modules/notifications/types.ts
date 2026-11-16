export enum NotificationChannel {
  EMAIL = 'email',
  SMS = 'sms',
}

export enum EmailNotificationType {
  VERIFICATION = 'verification',
  INVITE = 'invite',
  PASSWORD_RESET = 'password_reset',
}

export type EmailNotificationPayload =
  | { type: EmailNotificationType.VERIFICATION; email: string; verificationUrl: string }
  | {
      type: EmailNotificationType.INVITE;
      email: string;
      organizationName: string;
      inviteUrl: string;
    }
  | { type: EmailNotificationType.PASSWORD_RESET; email: string; resetUrl: string };

export type NotificationPayloadMap = {
  [NotificationChannel.EMAIL]: EmailNotificationPayload;
};

export type NotificationStrategy<Payload = unknown> = {
  channel: NotificationChannel;
  dispatch(payload: Payload): Promise<void>;
};
