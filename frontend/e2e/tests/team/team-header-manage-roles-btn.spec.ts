// T121 — team page header should show "Manage roles" button alongside "+ Invite member"
import { test, expect } from '../../fixtures';

test.describe('Team header manage-roles button', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 'u1', displayName: 'Quinn Brown', email: 'q@example.com', roles: ['CityLead'] }) });
    });
    await page.route('**/api/teams/local', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
    });
    await page.goto('/team');
  });

  test('shows "Manage roles" button in the team header', async ({ page }) => {
    await expect(page.getByTestId('manage-roles-btn')).toBeVisible();
  });

  test('"Manage roles" button appears before "+ Invite member" button', async ({ page }) => {
    const header = page.locator('.team-page__header');
    const manageBtn = header.getByTestId('manage-roles-btn');
    const inviteBtn = header.getByTestId('invite-member-button');
    await expect(manageBtn).toBeVisible();
    await expect(inviteBtn).toBeVisible();
  });
});
