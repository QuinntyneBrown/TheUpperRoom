// BUG-073: global-teams search input has no icon prefix; the
// global-search overlay (BUG-037) and contacts-list (BUG-072) both
// show a magnifying-glass icon prefix. Match for cross-feature
// consistency.
import { test, expect } from '../../fixtures';

test.describe('Global-teams search icon prefix', () => {
  test('search input has a magnifying-glass icon prefix', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: 'u1', displayName: 'Quinn', email: 'q@example.com', roles: ['CityLead'] }),
    }));
    await page.route('**/api/teams**', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ rows: [], total: 0 }),
    }));
    await page.goto('/teams');
    await expect(page.getByTestId('team-search-input')).toBeVisible({ timeout: 10000 });

    const icon = page.getByTestId('team-search-icon');
    await expect(icon).toBeVisible();
    await expect(icon).toHaveText('search');
  });
});
