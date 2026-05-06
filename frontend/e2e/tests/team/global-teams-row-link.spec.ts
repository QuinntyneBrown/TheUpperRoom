// BUG-138: each global-teams tr has routerLink + cursor:pointer but
// no focusable element. Convert the city cell to a link for
// keyboard accessibility.
import { test, expect } from '../../fixtures';

test.describe('Global teams row link', () => {
  test('city cell is an anchor to the team detail', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['Admin'] }),
    }));
    await page.route('**/api/teams**', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        rows: [{ id: 't1', city: 'Toronto', memberCount: 5, prayerLeadCount: 1, eventLeadCount: 1, communicationLeadCount: 1, activeHackathonCount: 2, partnerCount: 3 }],
        total: 1,
      }),
    }));
    await page.goto('/teams');
    const row = page.getByTestId('team-row-t1');
    await expect(row).toBeVisible({ timeout: 10000 });
    const link = row.locator('a[href$="/teams/t1"]').first();
    await expect(link).toBeVisible();
  });
});
