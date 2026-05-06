// BUG-033: design frame J2gC1T shows the notifications empty state with
// heading "You're all caught up" and subtitle "New activity from your
// team will appear here." Current implementation reads only
// "No notifications."
import { test, expect } from '../../fixtures';

test.describe('Notifications empty state copy', () => {
  test.beforeEach(async ({ page, auth }) => {
    await auth.signInAs('city-lead');

    await page.route('**/api/notifications*', (route) => {
      route.fulfill({
        status: 200, contentType: 'application/json',
        body: JSON.stringify({ rows: [], unreadCount: 0 }),
      });
    });

    await page.reload();
    await page.getByTestId('notification-bell').click();
    await expect(page.getByTestId('notifications-empty')).toBeVisible({ timeout: 5000 });
  });

  test('heading reads "You\'re all caught up"', async ({ page }) => {
    await expect(page.getByTestId('notifications-empty-title')).toHaveText("You're all caught up");
  });

  test('subtitle matches the design copy', async ({ page }) => {
    await expect(page.getByTestId('notifications-empty-subtitle')).toHaveText(
      'New activity from your team will appear here.'
    );
  });
});
