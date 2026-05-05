// Traces to: T109 — Partner detail stage card hint text wrong
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Partner detail stage hint', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('stage hint text mentions "optional reason" not "timestamp"', async ({ page, auth }) => {
    await auth.signInAs('city-lead');
    await page.goto('/partners');
    const firstPartner = page.getByTestId('partner-list-row').first();
    await firstPartner.click();
    await expect(page.getByTestId('stage-card')).toContainText('an optional reason');
    await expect(page.getByTestId('stage-card')).not.toContainText('timestamp');
  });
});
