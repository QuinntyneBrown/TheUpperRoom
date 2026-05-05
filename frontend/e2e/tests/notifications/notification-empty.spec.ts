// Traces to: T68 — notification center empty state needs data-testid
import { test, expect } from '../../fixtures';

test.describe('Notification center empty state', () => {
  test('shows empty state with data-testid when no notifications', async ({ page, auth }) => {
    await auth.signInAs('city-lead');

    await page.route('**/api/notifications*', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ rows: [], unreadCount: 0 }) });
    });

    await page.reload();
    await page.getByTestId('notification-bell').click();
    await expect(page.getByTestId('notifications-empty')).toBeVisible({ timeout: 3000 });
  });
});
