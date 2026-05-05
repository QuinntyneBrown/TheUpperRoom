// Traces to: Global error handler — visible user toast on unhandled error
// T51: unhandled JS error surfaces as a visible error toast
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Global error toast', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('shows error toast when an unhandled error occurs', async ({ auth, page }) => {
    await auth.signInAs('city-lead');
    await page.goto('/dashboard');

    await page.evaluate(() => {
      window.dispatchEvent(new ErrorEvent('error', {
        error: new Error('test unhandled error'),
        message: 'test unhandled error',
      }));
    });

    await expect(page.getByTestId('global-error-toast')).toBeVisible({ timeout: 3000 });
  });

  test('error toast disappears after a few seconds', async ({ auth, page }) => {
    await auth.signInAs('city-lead');
    await page.goto('/dashboard');

    await page.evaluate(() => {
      window.dispatchEvent(new ErrorEvent('error', {
        error: new Error('transient error'),
        message: 'transient error',
      }));
    });

    await expect(page.getByTestId('global-error-toast')).toBeVisible({ timeout: 3000 });
    await expect(page.getByTestId('global-error-toast')).not.toBeVisible({ timeout: 6000 });
  });
});
