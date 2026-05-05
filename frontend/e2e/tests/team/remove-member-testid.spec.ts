// Traces to: T74 — team remove button and invite POM need stable testids
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Team remove member testid', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('remove button in member row has data-testid', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    await page.route('**/api/team/members', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({
          status: 200, contentType: 'application/json',
          body: JSON.stringify([{ id: 'm1', displayName: 'Alice', email: 'alice@example.com', roles: [], isActive: true }]),
        });
      } else { route.continue(); }
    });

    await page.goto('/team');
    await expect(page.getByTestId('remove-member-btn').first()).toBeVisible({ timeout: 2000 });
  });
});
