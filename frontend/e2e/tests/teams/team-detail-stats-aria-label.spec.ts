// BUG-293: global-team-detail stats dl should have aria-label.
import { test, expect } from '../../fixtures';

test.describe('Global team detail stats aria-label', () => {
  test('stats dl has aria-label', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['NationalLead'] }),
    }));
    await page.route('**/api/teams/t1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 't1', city: 'Toronto', memberCount: 5,
        activeHackathonCount: 2, partnerCount: 3,
      }),
    }));
    await page.goto('/teams/t1');
    const dl = page.locator('dl.global-team-detail__stats');
    await expect(dl).toBeVisible({ timeout: 10000 });
    await expect(dl).toHaveAttribute('aria-label', /team statistics/i);
  });
});
