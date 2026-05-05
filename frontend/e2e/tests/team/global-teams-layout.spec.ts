// T129 — global teams page should not show both table and cards simultaneously
import { test, expect } from '../../fixtures';

const TEAMS = [
  { id: 't1', city: 'Toronto', memberCount: 5, prayerLeadCount: 1, eventLeadCount: 2, communicationLeadCount: 1, activeHackathonCount: 2, partnerCount: 10 },
  { id: 't2', city: 'Vancouver', memberCount: 3, prayerLeadCount: 0, eventLeadCount: 1, communicationLeadCount: 0, activeHackathonCount: 1, partnerCount: 4 },
];

test.describe('Global teams page layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 'u1', displayName: 'Quinn', email: 'q@example.com', roles: ['CityLead'] }) });
    });
    await page.route('**/api/teams**', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ rows: TEAMS, total: 2 }) });
    });
    await page.goto('/teams');
  });

  test('page header is visible', async ({ page }) => {
    await expect(page.locator('.global-teams-page__header')).toBeVisible();
  });

  test('search input is visible', async ({ page }) => {
    await expect(page.getByTestId('team-search-input')).toBeVisible();
  });

  test('table and cards are not both visible at desktop width', async ({ page }) => {
    const tableVisible = await page.locator('.teams-table').isVisible();
    const cardsVisible = await page.locator('.teams-cards').isVisible();
    // only one should be visible at a time at 1280px wide
    expect(tableVisible && cardsVisible).toBe(false);
  });

  test('teams data is shown (either table row or card)', async ({ page }) => {
    const hasTableRow = await page.getByTestId('team-row-t1').isVisible().catch(() => false);
    const hasCard = await page.getByTestId('team-card-t1').isVisible().catch(() => false);
    expect(hasTableRow || hasCard).toBe(true);
  });

  test('page title is smaller than browser default h1', async ({ page }) => {
    const title = page.locator('.global-teams-page__title');
    const fontSize = await title.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    expect(fontSize).toBeLessThan(28);
  });
});
