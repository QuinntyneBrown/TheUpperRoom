// T139 — global teams table rows must navigate to team detail page
import { test, expect } from '../../fixtures';

const TEAMS_RESPONSE = {
  rows: [
    { id: 't1', city: 'Toronto', memberCount: 5, prayerLeadCount: 2, eventLeadCount: 1, communicationLeadCount: 1, activeHackathonCount: 2, partnerCount: 3 },
  ],
  total: 1,
};

const TEAM_DETAIL = {
  id: 't1', city: 'Toronto', memberCount: 5, activeHackathonCount: 2, partnerCount: 3,
};

test.describe('Global teams — row navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 'u1', displayName: 'Quinn', email: 'q@test.com', roles: ['CityLead'] }) }));
    await page.route(/api\/teams(\?|$)/, r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(TEAMS_RESPONSE) }));
    await page.route('**/api/teams/t1', r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(TEAM_DETAIL) }));
    await page.goto('/teams', { waitUntil: 'load' });
    await page.waitForSelector('[data-testid=team-row-t1]', { timeout: 8000 });
  });

  test('clicking a team row navigates to /teams/:id', async ({ page }) => {
    await page.getByTestId('team-row-t1').click();
    await expect(page).toHaveURL(/\/teams\/t1/);
  });

  test('team detail page shows city name', async ({ page }) => {
    await page.getByTestId('team-row-t1').click();
    await page.waitForSelector('[data-testid=global-team-detail]', { timeout: 5000 });
    await expect(page.getByTestId('global-team-city')).toContainText('Toronto');
  });
});
