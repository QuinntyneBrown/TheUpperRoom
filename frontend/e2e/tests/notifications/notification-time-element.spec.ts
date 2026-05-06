// BUG-278: notification time should be a <time> element with datetime attribute.
import { test, expect } from '../../fixtures';

test.describe('Notification time element', () => {
  test('time renders as a <time datetime>', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/notifications**', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify([
        { id: 'n1', kind: 'NewContact', createdAt: '2026-04-01T12:00:00Z', isRead: true },
      ]),
    }));
    await page.goto('/');
    await page.getByTestId('notification-bell').click();
    const time = page.locator('time.notification-center__time').first();
    await expect(time).toBeVisible({ timeout: 10000 });
    await expect(time).toHaveAttribute('datetime', '2026-04-01T12:00:00Z');
  });
});
