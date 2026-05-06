// BUG-028: design frame x6ykzA shows the notification-center error-state
// Retry as a brand-primary button (CJdjz ref). The current implementation
// uses mat-raised-button. Switch to ur-button.
import { test, expect } from '../../fixtures';

test.describe('Notification-center retry uses brand primary', () => {
  test('retry button is a ur-button', async ({ page, auth }) => {
    await auth.signInAs('city-lead');

    await page.route('**/api/notifications*', (route) => {
      route.fulfill({ status: 502, body: 'Bad Gateway' });
    });

    await page.reload();
    await page.getByTestId('notification-bell').click();
    await expect(page.getByTestId('notifications-error')).toBeVisible();

    const btn = page.getByTestId('notifications-retry-btn');
    await expect(btn).toHaveJSProperty('tagName', 'UR-BUTTON');
  });
});
