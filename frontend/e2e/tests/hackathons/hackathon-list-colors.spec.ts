// T175: hackathon list page should use dark-theme color tokens, not light-mode fallbacks
import { test, expect } from '../../fixtures';

test.describe('Hackathon list color tokens', () => {
  test('error banner uses dark danger token not pink', async ({ page }) => {
    await page.route('**/api/auth/me', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json',
        body: JSON.stringify({ id: 'u1', displayName: 'Quinn', email: 'q@example.com', roles: ['Admin'] }) }));
    await page.route('**/api/hackathons', (route) =>
      route.fulfill({ status: 500, body: 'error' }));
    await page.goto('/hackathons');
    const err = page.getByTestId('hackathons-error');
    await expect(err).toBeVisible({ timeout: 5000 });
    const bg = await err.evaluate((el) => getComputedStyle(el).backgroundColor);
    // #fef2f2 = rgb(254, 242, 242) — must NOT be pink
    expect(bg).not.toBe('rgb(254, 242, 242)');
    const color = await err.evaluate((el) => getComputedStyle(el).color);
    // #dc2626 = rgb(220, 38, 38)
    expect(color).not.toBe('rgb(220, 38, 38)');
  });

  test('loading skeleton uses dark background not near-white', async ({ page }) => {
    await page.route('**/api/auth/me', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json',
        body: JSON.stringify({ id: 'u1', displayName: 'Quinn', email: 'q@example.com', roles: ['Admin'] }) }));
    await page.route('**/api/hackathons', (_) => { /* stall — never fulfills */ });
    await page.goto('/hackathons');
    const loading = page.getByTestId('hackathons-list-loading');
    await expect(loading).toBeVisible({ timeout: 5000 });
    const card = loading.locator('.hackathon-list-loading__card').first();
    const border = await card.evaluate((el) => getComputedStyle(el).borderBottomColor);
    // #e2e8f0 = rgb(226, 232, 240) — must NOT be light gray
    expect(border).not.toBe('rgb(226, 232, 240)');
  });
});
