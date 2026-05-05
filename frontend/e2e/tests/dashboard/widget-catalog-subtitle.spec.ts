// Traces to: T111 — Widget catalog dialog missing subtitle
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Widget catalog subtitle', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('widget catalog shows subtitle text', async ({ page, auth }) => {
    await auth.signInAs('city-lead');
    await page.goto('/dashboard');
    await page.getByTestId('add-widget-btn').click();
    await expect(page.getByTestId('widget-catalog-dialog')).toContainText(
      'Drag a widget onto your dashboard, or click to add it at the next free slot.'
    );
  });
});
