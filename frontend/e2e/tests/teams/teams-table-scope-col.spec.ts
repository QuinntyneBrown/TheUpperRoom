// BUG-264: teams-table headers should have scope="col".
import { test, expect } from '../../fixtures';

test.describe('Global teams table scope', () => {
  test('all column headers have scope="col"', async ({ page }) => {
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
    const headers = page.locator('table.teams-table thead th');
    await expect(headers).toHaveCount(7, { timeout: 10000 });
    const scopes = await headers.evaluateAll(els => els.map(el => el.getAttribute('scope')));
    expect(scopes.every(s => s === 'col')).toBe(true);
  });
});
