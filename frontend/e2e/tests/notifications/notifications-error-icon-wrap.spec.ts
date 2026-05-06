// BUG-120: notifications-error renders a bare mat-icon while
// the empty state already has a circular wrap. Make consistent.
import { test, expect } from '../../fixtures';

test.describe('Notifications error icon wrap', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/notifications**', (r) => r.fulfill({
      status: 500, contentType: 'application/json', body: '{}',
    }));
    await page.goto('/dashboard');
    await expect(page.getByTestId('notification-bell')).toBeVisible({ timeout: 10000 });
    await page.getByTestId('notification-bell').click();
    await expect(page.getByTestId('notifications-error')).toBeVisible({ timeout: 5000 });
  });

  test('wifi_off icon is wrapped in a circular bordered container', async ({ page }) => {
    const wrap = page.getByTestId('notifications-error-icon-wrap');
    await expect(wrap).toBeVisible();

    const box = await wrap.boundingBox();
    expect(box).not.toBeNull();
    expect(Math.abs(box!.width - box!.height)).toBeLessThan(2);

    const radius = await wrap.evaluate(el => getComputedStyle(el).borderRadius);
    expect(radius).toMatch(/9999px|50%/);
  });
});
