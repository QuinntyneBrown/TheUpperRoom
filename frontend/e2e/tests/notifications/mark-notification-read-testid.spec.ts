// BUG-277: notification mark-read button should have a unique data-testid.
import { test, expect } from '../../fixtures';

test.describe('Notification mark-read testid', () => {
  test('mark-notification-read-{id} is present for unread items', async ({ page }) => {
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
    await expect(page.getByTestId('mark-notification-read-n1')).toBeVisible({ timeout: 10000 });
  });
});
