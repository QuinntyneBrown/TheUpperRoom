// Traces to: T110 — Partners list CTA button text should be "+ Add partner"
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Partners list add partner button', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('CTA button says "+ Add partner"', async ({ page, auth }) => {
    await auth.signInAs('city-lead');
    await page.goto('/partners');
    await expect(page.getByTestId('new-partner-btn')).toHaveText('+ Add partner');
  });
});
