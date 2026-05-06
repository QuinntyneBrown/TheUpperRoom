// BUG-043: notification-center's "Mark all read" header action uses
// mat-button. Switch to ur-button.
import { test, expect } from '../../fixtures';

test.describe('Notification-center mark-all-read button style', () => {
  test('mark-all-read button is rendered as ur-button', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/dashboards/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ json: JSON.stringify({ items: [] }) }),
    }));
    await page.route('**/api/notifications**', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify([
        { id: 'n1', kind: 'PartnerStageChanged', isRead: false, createdAt: '2026-05-01T00:00:00Z' },
      ]),
    }));
    await page.goto('/dashboard');
    await page.getByTestId('notification-bell').click();
    await expect(page.getByTestId('notifications-panel')).toBeVisible({ timeout: 5000 });
    await expect(page.getByTestId('mark-all-read')).toHaveJSProperty('tagName', 'UR-BUTTON');
  });
});
