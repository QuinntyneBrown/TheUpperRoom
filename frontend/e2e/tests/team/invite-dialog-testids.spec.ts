// Traces to: T73 — invite dialog send button and role checkboxes need data-testid
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Invite dialog testids', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('send invite button has data-testid', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    await page.route('**/api/team/members', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
      } else { route.continue(); }
    });

    await page.goto('/team');
    await page.getByTestId('invite-member-button').click();
    await expect(page.getByTestId('invite-dialog')).toBeVisible({ timeout: 2000 });
    await expect(page.getByTestId('send-invite-btn')).toBeVisible();
  });

  test('role checkboxes have data-testid', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    await page.route('**/api/team/members', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
      } else { route.continue(); }
    });

    await page.goto('/team');
    await page.getByTestId('invite-member-button').click();
    await expect(page.getByTestId('invite-dialog')).toBeVisible({ timeout: 2000 });
    await expect(page.getByTestId('invite-role-CityLead')).toBeVisible();
  });
});
