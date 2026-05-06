// BUG-239: shell offline-banner should expose a stable testid on the message.
import { test, expect } from '../../fixtures';

test.describe('Offline banner message testid', () => {
  test('offline-banner-message is present when offline', async ({ page, context }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.goto('/');
    await context.setOffline(true);
    await page.evaluate(() => window.dispatchEvent(new Event('offline')));
    await expect(page.getByTestId('offline-banner-message')).toBeVisible({ timeout: 10000 });
  });
});
