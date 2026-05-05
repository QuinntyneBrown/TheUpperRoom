// T174: dashboard page should use dark-theme color tokens, not light-mode Slate fallbacks
import { test, expect } from '../../fixtures';

test.describe('Dashboard color tokens', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json',
        body: JSON.stringify({ id: 'u1', displayName: 'Quinn', email: 'q@example.com', roles: ['Admin'] }) }));
    await page.route('**/api/dashboard', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) }));
    await page.goto('/dashboard');
  });

  test('header border uses dark token not light gray', async ({ page }) => {
    const header = page.locator('.dashboard-page__header');
    await expect(header).toBeVisible();
    const border = await header.evaluate((el) => getComputedStyle(el).borderBottomColor);
    // #e2e8f0 in rgb = rgb(226, 232, 240) — must NOT be that
    expect(border).not.toBe('rgb(226, 232, 240)');
  });

  test('empty zone uses dark background not Slate', async ({ page }) => {
    const zone = page.locator('.dashboard-page__empty-zone');
    await expect(zone).toBeVisible();
    const bg = await zone.evaluate((el) => getComputedStyle(el).backgroundColor);
    // #1e293b in rgb = rgb(30, 41, 59) — must NOT be that
    expect(bg).not.toBe('rgb(30, 41, 59)');
  });

  test('load-error banner uses dark danger token not pink', async ({ page }) => {
    await page.unroute('**/api/dashboard');
    await page.route('**/api/dashboard', (route) =>
      route.fulfill({ status: 500, body: 'error' }));
    await page.reload();
    const err = page.getByTestId('dashboard-load-error');
    await expect(err).toBeVisible({ timeout: 5000 });
    const bg = await err.evaluate((el) => getComputedStyle(el).backgroundColor);
    // #fef2f2 in rgb = rgb(254, 242, 242) — must NOT be that
    expect(bg).not.toBe('rgb(254, 242, 242)');
    const color = await err.evaluate((el) => getComputedStyle(el).color);
    // #dc2626 in rgb = rgb(220, 38, 38) — must NOT be that
    expect(color).not.toBe('rgb(220, 38, 38)');
  });
});
