// BUG-013: design frame U7ry4 shows the profile menu with four
// entries: Profile & preferences, Workspace settings, Help & support,
// Sign out. Implementation only has Workspace settings + Sign out.
import { test, expect } from '../../fixtures';

test.describe('Profile menu items', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/dashboards/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ json: JSON.stringify({ items: [] }) }),
    }));
    await page.goto('/dashboard');
    await expect(page.getByTestId('profile-menu-trigger')).toBeVisible({ timeout: 10000 });
    await page.getByTestId('profile-menu-trigger').click();
  });

  test('shows Profile & preferences entry', async ({ page }) => {
    await expect(page.getByTestId('profile-menu-profile')).toBeVisible();
    await expect(page.getByTestId('profile-menu-profile')).toContainText(/profile/i);
  });

  test('shows Help & support entry', async ({ page }) => {
    await expect(page.getByTestId('profile-menu-help')).toBeVisible();
    await expect(page.getByTestId('profile-menu-help')).toContainText(/help/i);
  });
});
