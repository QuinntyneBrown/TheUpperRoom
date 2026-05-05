// T172: team page should show members in role-based card grid, not flat table
import { test, expect } from '../../fixtures';

const MEMBERS = [
  { id: 'u1', displayName: 'Quinn Brown', email: 'quinn@example.com', roles: ['CityLead'], isActive: true },
  { id: 'u2', displayName: 'Pat Smith', email: 'pat@example.com', roles: ['PrayerLead'], isActive: true },
  { id: 'u3', displayName: 'Alex Jones', email: 'alex@example.com', roles: ['EventLead'], isActive: true },
];

test.describe('Team role grid layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json',
        body: JSON.stringify({ id: 'u1', displayName: 'Quinn', email: 'q@example.com', roles: ['CityLead'] }) }));
    await page.route('**/api/team/local', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MEMBERS) }));
    await page.goto('/team');
    await expect(page.getByTestId('team-role-grid')).toBeVisible({ timeout: 5000 });
  });

  test('team page shows role-based card grid', async ({ page }) => {
    await expect(page.getByTestId('role-card-CityLead')).toBeVisible();
    await expect(page.getByTestId('role-card-PrayerLead')).toBeVisible();
    await expect(page.getByTestId('role-card-EventLead')).toBeVisible();
    await expect(page.getByTestId('role-card-CommunicationLead')).toBeVisible();
  });

  test('city lead card shows Quinn Brown', async ({ page }) => {
    const cityCard = page.getByTestId('role-card-CityLead');
    await expect(cityCard).toContainText('Quinn Brown');
  });

  test('role cards are displayed in a grid (not a table)', async ({ page }) => {
    await expect(page.locator('table.team-table')).not.toBeVisible();
    const grid = page.getByTestId('team-role-grid');
    const display = await grid.evaluate((el) => getComputedStyle(el).display);
    expect(['grid', 'flex']).toContain(display);
  });
});
