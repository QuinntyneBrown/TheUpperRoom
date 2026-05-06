// BUG-169: mobile/tablet topbar profile-menu trigger lacks
// data-testid. Add 'topbar-profile-menu-trigger'.
import { test, expect } from '../../fixtures';

test.describe('Mobile topbar profile menu trigger testid', () => {
  test('trigger has data-testid="topbar-profile-menu-trigger"', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.goto('/dashboard');
    const trigger = page.getByTestId('topbar-profile-menu-trigger');
    await expect(trigger).toBeVisible({ timeout: 10000 });
  });
});
