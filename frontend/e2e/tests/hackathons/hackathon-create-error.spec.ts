// Traces to: 21 — Create Hackathon
// L2-021: hackathon create shows error toast on API failure
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Hackathon create save error', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('shows error toast when create API fails with 500', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    await page.route('**/api/hackathons', (route) => {
      if (route.request().method() === 'POST') {
        route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'server error' }) });
      } else {
        route.continue();
      }
    });

    await page.goto('/hackathons/new');
    await page.getByLabel(/title/i).fill('Test Hackathon');
    await page.getByLabel(/host city/i).fill('Toronto');
    await page.getByLabel(/start date/i).fill('2026-09-01');
    await page.getByLabel(/end date/i).fill('2026-09-03');
    await page.getByRole('button', { name: /create/i }).click();
    await expect(page.getByTestId('create-save-error-toast')).toBeVisible({ timeout: 3000 });
  });
});
