import { expect, Page } from '@playwright/test';

export class NotificationsPanel {
  constructor(private page: Page) {}

  async open() {
    await this.page.getByTestId('notification-bell').click();
    await expect(this.page.getByTestId('notifications-panel')).toBeVisible();
  }

  panel() {
    return this.page.getByTestId('notifications-panel');
  }

  notificationItem(index: number) {
    return this.page.getByTestId(`notification-item-${index}`);
  }

  unreadBadge() {
    return this.page.getByTestId('unread-badge');
  }

  async assertContains(kind: string) {
    await expect(this.page.getByTestId('notifications-panel').getByText(kind)).toBeVisible({ timeout: 5000 });
  }
}
