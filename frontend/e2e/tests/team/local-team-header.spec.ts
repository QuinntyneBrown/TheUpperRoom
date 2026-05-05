// T163: team page header should be a styled topbar with title left, actions right
import { test, expect } from '../../fixtures';

const MEMBERS = [
  { id: 'm1', displayName: 'Quinn Brown', email: 'q@example.com', roles: ['CityLead'], isActive: true },
];

test.describe('Local team page header', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json',
        body: JSON.stringify({ id: 'u1', displayName: 'Quinn', email: 'q@example.com', roles: ['CityLead'] }) });
    });
    await page.route('**/api/teams/local', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MEMBERS) });
    });
    await page.goto('/team');
    await expect(page.getByTestId('local-team-page')).toBeVisible({ timeout: 5000 });
  });

  test('team page header is a flex row (title and actions side by side)', async ({ page }) => {
    const header = page.locator('.team-page__header');
    await expect(header).toBeVisible();
    const display = await header.evaluate((el) => getComputedStyle(el).display);
    expect(display).toBe('flex');
    const alignItems = await header.evaluate((el) => getComputedStyle(el).alignItems);
    expect(alignItems).toBe('center');
    const justifyContent = await header.evaluate((el) => getComputedStyle(el).justifyContent);
    expect(['space-between', 'space_between']).toContain(justifyContent);
  });

  test('team page header has a bottom border', async ({ page }) => {
    const header = page.locator('.team-page__header');
    const borderBottom = await header.evaluate((el) => getComputedStyle(el).borderBottomWidth);
    expect(parseFloat(borderBottom)).toBeGreaterThanOrEqual(1);
  });

  test('team page title is visible', async ({ page }) => {
    const title = page.locator('.team-page__title');
    await expect(title).toBeVisible();
    await expect(title).toContainText('Team');
  });

  test('invite member button is visible and in the header', async ({ page }) => {
    await expect(page.getByTestId('invite-member-button')).toBeVisible();
  });

  test('manage roles button is visible', async ({ page }) => {
    await expect(page.getByTestId('manage-roles-btn')).toBeVisible();
  });
});
