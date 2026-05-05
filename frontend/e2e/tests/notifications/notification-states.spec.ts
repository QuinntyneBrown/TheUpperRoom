// Traces to: Notifications - Loading Skeleton, Notifications - Error State
// L2-023: notification panel loading skeleton; L2-024: notification panel error state
import { test, expect } from '../../fixtures';

test.describe('Notification panel states', () => {
  test('shows loading skeleton while notifications are loading', async ({ page, auth }) => {
    await auth.signInAs('city-lead');

    let resolveNotifs!: () => void;
    await page.route('**/api/notifications*', async (route) => {
      await new Promise<void>((res) => { resolveNotifs = res; });
      await route.continue();
    });

    await page.reload();
    await page.getByTestId('notification-bell').click();
    await expect(page.getByTestId('notifications-loading-skeleton')).toBeVisible();

    resolveNotifs();
    await expect(page.getByTestId('notifications-loading-skeleton')).not.toBeVisible({ timeout: 3000 });
  });

  test('shows error state when notification load fails', async ({ page, auth }) => {
    await auth.signInAs('city-lead');

    await page.route('**/api/notifications*', (route) => {
      route.fulfill({ status: 502, body: 'Bad Gateway' });
    });

    await page.reload();
    await page.getByTestId('notification-bell').click();
    await expect(page.getByTestId('notifications-error')).toBeVisible();
  });

  test('retry button reloads notifications after error', async ({ page, auth }) => {
    await auth.signInAs('city-lead');

    let callCount = 0;
    await page.route('**/api/notifications*', (route) => {
      callCount++;
      if (callCount === 1) {
        route.fulfill({ status: 502, body: 'Bad Gateway' });
      } else {
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ rows: [], unreadCount: 0 }) });
      }
    });

    await page.reload();
    await page.getByTestId('notification-bell').click();
    await expect(page.getByTestId('notifications-error')).toBeVisible();
    await page.getByTestId('notifications-retry-btn').click();
    await expect(page.getByTestId('notifications-error')).not.toBeVisible({ timeout: 3000 });
  });
});
