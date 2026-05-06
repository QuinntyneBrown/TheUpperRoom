// BUG-216: global-team-detail back link uses "All Teams" in Title
// Case, while the global-teams page is now "All teams" (BUG-183).
import { test, expect } from '../../fixtures';

test.describe('Global-team back link text', () => {
  test('back link uses sentence case', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['Admin'] }),
    }));
    await page.route('**/api/teams/t1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: 't1', city: 'Toronto', memberCount: 0, activeHackathonCount: 0, partnerCount: 0 }),
    }));
    await page.goto('/teams/t1');
    const link = page.getByTestId('global-team-back-link');
    await expect(link).toBeVisible({ timeout: 10000 });
    await expect(link).toContainText(/All teams/);
    await expect(link).not.toContainText(/All Teams/);
  });
});
