// BUG-110: notifications panel header h2 "Notifications" has no
// testid while sibling content uses testids extensively. Mirrors
// the heading-testid pattern from BUG-094/099/108.
import { test, expect } from '../../fixtures';

test.describe('Notifications panel title testid', () => {
  test('"Notifications" h2 has testid notifications-panel-title', async ({ page, auth }) => {
    await auth.signInAs('city-lead');
    await page.route('**/api/notifications*', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ rows: [], unreadCount: 0 }),
    }));
    await page.reload();

    const bell = page.getByTestId('notification-bell');
    await expect(bell).toBeVisible({ timeout: 5000 });
    await bell.click();

    const title = page.getByTestId('notifications-panel-title');
    await expect(title).toHaveJSProperty('tagName', 'H2');
    await expect(title).toHaveText('Notifications');
  });
});
