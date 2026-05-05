import { Page } from '@playwright/test';

export class NotificationsPanel {
  constructor(private page: Page) {}

  async open() {
    await this.page.getByTestId('notifications-trigger').click();
  }

  panel() {
    return this.page.getByTestId('notifications-panel');
  }

  notificationItem(index: number) {
    return this.page.getByTestId(`notification-item-${index}`);
  }

  unreadBadge() {
    return this.page.getByTestId('notifications-unread-badge');
  }
}
