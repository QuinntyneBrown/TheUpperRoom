// Traces to: T69 — hackathon create/edit submit buttons need data-testid
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Hackathon form submit button testids', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('create page has plan-hackathon-btn testid', async ({ auth, page }) => {
    await auth.signInAs('city-lead');
    await page.goto('/hackathons/new');
    await expect(page.getByTestId('plan-hackathon-btn')).toBeVisible({ timeout: 3000 });
  });

  test('edit page has hackathon-edit-save-btn testid', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    const hackathon = {
      id: 'h-edit1', title: 'Edit Btn Hack', hostCity: 'Dublin',
      startDate: '2026-06-01', endDate: '2026-06-03',
      stage: 'Discover', products: [], partners: [], history: [], deletedAt: null,
    };
    await page.route('**/api/hackathons/h-edit1', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(hackathon) });
      } else { route.continue(); }
    });

    await page.goto('/hackathons/h-edit1/edit');
    await expect(page.getByTestId('hackathon-edit-save-btn')).toBeVisible({ timeout: 3000 });
  });
});
