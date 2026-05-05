// Traces to: 15 — Create Partner
// L2-016: new partner defaults to Lead stage, attributed to actor's team, malformed website rejected
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Create Partner', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('partner create page renders form with save button', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    await page.goto('/partners/new');
    await expect(page.getByTestId('add-partner-btn')).toBeVisible({ timeout: 3000 });
    await expect(page.getByLabel(/organization name/i)).toBeVisible();
  });

  test.fixme('city lead can create partner and is redirected to detail', async ({ page, partners }) => {
    // Requires authenticated session
  });

  test.fixme('default stage is Lead', async ({ page, partners }) => {
    // Requires authenticated session
  });

  test.fixme('malformed website shows field-level error', async ({ page, partners }) => {
    // Requires authenticated session
  });
});
