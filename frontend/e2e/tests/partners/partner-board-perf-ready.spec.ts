// Traces to: 63 — Page-Load Performance Budget Harness — data-perf-ready signal
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Partner board data-perf-ready', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('partner board page sets data-perf-ready="partner-board"', async ({ auth, page }) => {
    await auth.signInAs('city-lead');
    await page.goto('/partners/board');
    const el = page.locator('[data-perf-ready="partner-board"]');
    await expect(el).toBeVisible({ timeout: 5000 });
  });
});
