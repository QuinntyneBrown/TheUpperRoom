// Traces to: T83 — hackathon and partner list card links need dynamic data-testid
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Hackathon list card testid', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('hackathon list card has dynamic data-testid', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    const rows = [{ id: 'h-t83', title: 'T83 Hackathon', hostCity: 'Toronto', startDate: '2026-09-01', endDate: '2026-09-03', currentStage: 'Planning' }];
    await page.route('**/api/hackathons', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(rows) });
      } else { route.continue(); }
    });

    await page.goto('/hackathons');
    await expect(page.getByTestId('hackathon-card-h-t83')).toBeVisible({ timeout: 2000 });
  });
});
