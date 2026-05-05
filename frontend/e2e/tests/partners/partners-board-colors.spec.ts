// T171: partners board must use design-system dark palette, not Slate/light fallbacks
import { test, expect } from '../../fixtures';

const PARTNERS = [
  { id: 'p1', teamId: 't1', name: 'FaithTech Toronto', city: 'Toronto', stage: 'InFunnel', version: 1 },
];

test.describe('Partners board color tokens', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json',
        body: JSON.stringify({ id: 'u1', displayName: 'Quinn', email: 'q@example.com', roles: ['CityLead'] }) }));
    await page.route('**/api/partners*', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(PARTNERS) }));
    await page.goto('/partners/board');
    await expect(page.getByTestId('column-InFunnel')).toBeVisible({ timeout: 5000 });
  });

  test('board column has dark background (not Slate)', async ({ page }) => {
    const col = page.getByTestId('column-InFunnel');
    const bg = await col.evaluate((el) => getComputedStyle(el).backgroundColor);
    // Must be #101018 rgb(16,16,24), not Slate #1e293b rgb(30,41,59)
    expect(bg).toBe('rgb(16, 16, 24)');
  });

  test('board card has dark card background (not Slate)', async ({ page }) => {
    const card = page.getByTestId('partner-card-p1');
    const bg = await card.evaluate((el) => getComputedStyle(el).backgroundColor);
    // Must be #16161F rgb(22,22,31), not Slate #334155 rgb(51,65,85)
    expect(bg).toBe('rgb(22, 22, 31)');
  });

  test('board column has correct border color', async ({ page }) => {
    const col = page.getByTestId('column-InFunnel');
    const border = await col.evaluate((el) => getComputedStyle(el).borderTopColor);
    // Must be #222233 rgb(34,34,51)
    expect(border).toBe('rgb(34, 34, 51)');
  });
});
