import { EmailNotificationStrategy } from './strategies/email-notification.strategy';
import { NotificationChannel } from './types';
import type { NotificationPayloadMap, NotificationStrategy } from './types';

export class NotificationService {
  private readonly strategies = new Map<NotificationChannel, NotificationStrategy>();

  constructor() {
    this.strategies.set(NotificationChannel.EMAIL, new EmailNotificationStrategy());
  }

  async sendNotification<C extends keyof NotificationPayloadMap>(
    channel: C,
    payload: NotificationPayloadMap[C],
  ): Promise<void> {
    const strategy = this.strategies.get(channel);
    if (!strategy) {
      throw new Error(`No notification strategy registered for channel: ${channel}`);
    }
    await strategy.dispatch(payload);
  }
}
