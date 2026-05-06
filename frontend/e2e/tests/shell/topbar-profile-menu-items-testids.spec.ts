// BUG-237: mobile-topbar profile menu items lack testids while the
// desktop sidenav profile menu items have them.
import { test, expect } from '../../fixtures';

test.describe('Mobile-topbar profile menu items testids', () => {
  test('settings and sign-out items expose testids', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'mobile viewport sufficient on chromium');
    await page.setViewportSize({ width: 360, height: 740 });
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.goto('/dashboard');
    await page.getByTestId('topbar-profile-menu-trigger').click();
    await expect(page.getByTestId('topbar-profile-menu-settings')).toBeVisible();
    await expect(page.getByTestId('topbar-profile-menu-sign-out')).toBeVisible();
  });
});
