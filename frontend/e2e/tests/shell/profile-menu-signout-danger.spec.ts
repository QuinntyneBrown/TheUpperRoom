// BUG-097: design frame U7ry4 shows the profile menu Sign out item
// in the danger color (danger fill + danger icon/text). Implementation
// uses default Material styling.
import { test, expect } from '../../fixtures';

test.describe('Profile menu sign-out danger styling', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.goto('/dashboard');
    await expect(page.getByTestId('profile-menu-trigger')).toBeVisible({ timeout: 10000 });
    await page.getByTestId('profile-menu-trigger').click();
    await expect(page.getByTestId('sign-out-button')).toBeVisible();
  });

  test('sign-out item text/icon are colored with the danger token', async ({ page }) => {
    const btn = page.getByTestId('sign-out-button');
    const colors = await btn.evaluate((el) => {
      const cs = getComputedStyle(el);
      const icon = el.querySelector('mat-icon');
      return {
        text: cs.color,
        icon: icon ? getComputedStyle(icon).color : '',
      };
    });
    // danger token resolves to a red-ish RGB; assert a non-default
    // (not pure white/black/grey) red-leaning color is applied.
    const reddish = (rgb: string) => {
      const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (!m) return false;
      const r = +m[1], g = +m[2], b = +m[3];
      return r > 180 && r > g + 40 && r > b + 40;
    };
    expect(reddish(colors.text)).toBe(true);
    expect(reddish(colors.icon)).toBe(true);
  });
});
