// Traces to: Auth pages — error state testability
// T59: sign-in and reset error divs have data-testid for E2E targeting
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Auth error data-testid', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('sign-in page shows error with data-testid on bad credentials', async ({ page }) => {
    await page.route('**/api/auth/sign-in', (route) => {
      route.fulfill({ status: 401, contentType: 'application/json', body: JSON.stringify({ message: 'Invalid credentials' }) });
    });

    await page.goto('/auth/sign-in');
    await page.getByLabel('Email').fill('bad@example.com');
    await page.getByLabel('Password').fill('wrongpass');
    await page.getByTestId('sign-in-submit-btn').click();

    await expect(page.getByTestId('sign-in-error')).toBeVisible({ timeout: 3000 });
  });
});
