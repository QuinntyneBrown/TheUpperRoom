// BUG-111: team-page h1 "Team" has no testid while sibling content
// uses testids extensively. Mirrors BUG-094/099/108/110.
import { test, expect } from '../../fixtures';

test.describe('Team page title testid', () => {
  test('"Team" h1 has testid team-page-title', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/team/local**', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ rows: [], total: 0 }),
    }));
    await page.goto('/team');
    await expect(page.getByTestId('local-team-page')).toBeVisible({ timeout: 10000 });

    const title = page.getByTestId('team-page-title');
    await expect(title).toHaveJSProperty('tagName', 'H1');
    await expect(title).toHaveText('Team');
  });
});
