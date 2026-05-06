// BUG-168: mobile/tablet topbar Sign out button needs the same
// `profile-menu__sign-out` class as the desktop one for danger color.
import { test, expect } from '../../fixtures';

test.describe('Mobile topbar Sign out danger styling', () => {
  test('topbar Sign out button has profile-menu__sign-out class', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.goto('/dashboard');
    const trigger = page.locator('[aria-label="Profile menu"]').first();
    await expect(trigger).toBeVisible({ timeout: 10000 });
    await trigger.click();
    const signOut = page.locator('button.profile-menu__sign-out', { hasText: 'Sign out' });
    await expect(signOut).toBeVisible();
  });
});
