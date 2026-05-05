// T130 — auth pages should not show the sidebar nav
import { test, expect } from '../../fixtures';

test.describe('Auth pages hide sidebar', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.route('**/api/auth/me', (route) => {
      route.fulfill({ status: 401, body: '{}' });
    });
  });

  test('sign-in page does not show side nav', async ({ page }) => {
    await page.goto('/auth/sign-in');
    const sidenav = page.getByTestId('side-nav');
    await expect(sidenav).not.toBeVisible();
  });

  test('sign-in page shows auth card', async ({ page }) => {
    await page.goto('/auth/sign-in');
    const card = page.locator('.auth-card');
    await expect(card).toBeVisible();
  });

  test('auth card is centered (not flush left)', async ({ page }) => {
    await page.goto('/auth/sign-in');
    const card = page.locator('.auth-card');
    const box = await card.boundingBox();
    // card should be at least 200px from left edge (not flush against sidebar/left)
    expect(box!.x).toBeGreaterThan(200);
  });
});
