// BUG-090: notification-bell button has static aria-label="Notifications".
// Mirror BUG-089 (hamburger) — bind to the open() signal so it
// toggles between "Open notifications" and "Close notifications".
import { test, expect } from '../../fixtures';

test.describe('Notification-bell aria-label reflects open state', () => {
  test('clicking the bell toggles aria-label between Open and Close', async ({ page, auth }) => {
    await auth.signInAs('city-lead');

    await page.route('**/api/notifications*', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ rows: [], unreadCount: 0 }),
    }));

    await page.reload();
    const bell = page.getByTestId('notification-bell');
    await expect(bell).toBeVisible({ timeout: 5000 });

    await expect(bell).toHaveAttribute('aria-label', 'Open notifications');

    await bell.click();
    await expect(bell).toHaveAttribute('aria-label', 'Close notifications');
  });
});
