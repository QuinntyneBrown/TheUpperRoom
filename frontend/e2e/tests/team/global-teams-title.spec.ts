// BUG-183: global-teams h1 uses Title Case ("All Teams") and lacks
// a testid. Mirrors BUG-130/133 cross-feature page-title conventions.
import { test, expect } from '../../fixtures';

test.describe('Global-teams page title', () => {
  test('"All teams" h1 has testid and uses sentence case', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['Admin'] }),
    }));
    await page.route('**/api/teams**', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ rows: [], total: 0 }),
    }));
    await page.goto('/teams');

    const title = page.getByTestId('global-teams-title');
    await expect(title).toBeVisible({ timeout: 10000 });
    await expect(title).toHaveJSProperty('tagName', 'H1');
    await expect(title).toHaveText('All teams');
  });
});
