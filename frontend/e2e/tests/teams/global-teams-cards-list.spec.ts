// BUG-204: teams-cards mobile grid should render as <ul><li>.
import { test, expect } from '../../fixtures';

test.describe('Teams cards list semantics', () => {
  test('teams cards render in a <ul aria-label> with <li> rows', async ({ page }) => {
    await page.setViewportSize({ width: 600, height: 900 });
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['NationalLead'] }),
    }));
    await page.route('**/api/teams**', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        items: [
          { id: 't1', city: 'Toronto', memberCount: 5, prayerLeadCount: 1, eventLeadCount: 1, communicationLeadCount: 1, activeHackathonCount: 2, partnerCount: 3 },
          { id: 't2', city: 'Vancouver', memberCount: 3, prayerLeadCount: 1, eventLeadCount: 0, communicationLeadCount: 1, activeHackathonCount: 1, partnerCount: 2 },
        ],
        total: 2,
      }),
    }));
    await page.goto('/teams');
    const ul = page.locator('ul.teams-cards');
    await expect(ul).toBeVisible({ timeout: 10000 });
    await expect(ul).toHaveAttribute('aria-label', /all teams/i);
    expect(await ul.locator('> li').count()).toBe(2);
  });
});
