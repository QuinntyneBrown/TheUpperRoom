// BUG-263: global-teams table should have data-testid.
import { test, expect } from '../../fixtures';

test.describe('Global teams table testid', () => {
  test('teams-table testid is present', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['NationalLead'] }),
    }));
    await page.route('**/api/teams**', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        items: [{ id: 't1', city: 'Toronto', memberCount: 5, prayerLeadCount: 1, eventLeadCount: 1, communicationLeadCount: 1, activeHackathonCount: 2, partnerCount: 3 }],
        total: 1,
      }),
    }));
    await page.goto('/teams');
    await expect(page.getByTestId('teams-table')).toBeVisible({ timeout: 10000 });
  });
});
