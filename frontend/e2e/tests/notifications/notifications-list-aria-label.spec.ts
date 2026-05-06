// BUG-209: notifications list ul should have aria-label.
import { test, expect } from '../../fixtures';

test.describe('Notifications list aria-label', () => {
  test('notification list has aria-label', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/notifications**', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify([
        { id: 'n1', kind: 'NewContact', createdAt: '2026-04-01T12:00:00Z', isRead: false },
      ]),
    }));
    await page.goto('/');
    await page.getByTestId('notification-bell').click();
    const ul = page.locator('ul.notification-center__list');
    await expect(ul).toBeVisible({ timeout: 10000 });
    await expect(ul).toHaveAttribute('aria-label', /notifications/i);
  });
});
