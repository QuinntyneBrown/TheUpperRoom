// Traces to: T69 — partner create/edit submit buttons need data-testid
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Partner form submit button testids', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('create page has add-partner-btn testid', async ({ auth, page }) => {
    await auth.signInAs('city-lead');
    await page.goto('/partners/new');
    await expect(page.getByTestId('add-partner-btn')).toBeVisible({ timeout: 3000 });
  });

  test('edit page has partner-edit-save-btn testid', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    const partner = {
      id: 'p-edit1', name: 'Edit Btn Church', city: 'Cork',
      stage: 'Lead', contacts: [], history: [], notes: [], deletedAt: null,
    };
    await page.route('**/api/partners/p-edit1', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(partner) });
      } else { route.continue(); }
    });

    await page.goto('/partners/p-edit1/edit');
    await expect(page.getByTestId('partner-edit-save-btn')).toBeVisible({ timeout: 3000 });
  });
});
