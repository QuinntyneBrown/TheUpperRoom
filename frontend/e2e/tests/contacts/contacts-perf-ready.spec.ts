// Traces to: 63 — Page-Load Performance Budget Harness — data-perf-ready signal
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Contacts list data-perf-ready', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('contacts list page sets data-perf-ready="contacts"', async ({ auth, page }) => {
    await auth.signInAs('city-lead');
    await page.goto('/contacts');
    const el = page.locator('[data-perf-ready="contacts"]');
    await expect(el).toBeVisible({ timeout: 5000 });
  });
});
