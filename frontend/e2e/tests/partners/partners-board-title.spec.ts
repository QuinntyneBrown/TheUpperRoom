// BUG-116: partners-board h1 "Partners" has no testid while sibling
// content uses testids extensively. Mirrors BUG-112 (partners-list).
import { test, expect } from '../../fixtures';

test.describe('Partners board title testid', () => {
  test('"Partners" h1 has testid partners-board-title', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/partners**', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: '[]',
    }));
    await page.goto('/partners/board');
    await expect(page.getByTestId('partner-board')).toBeVisible({ timeout: 10000 });

    const title = page.getByTestId('partners-board-title');
    await expect(title).toHaveJSProperty('tagName', 'H1');
    await expect(title).toHaveText('Partners');
  });
});
