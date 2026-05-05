// Traces to: 27 — Remove Team Member
// L2-027: shows error toast when remove member API fails
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Remove team member error', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('shows error toast when remove member fails', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    await page.route('**/api/team/members/*', (route) => {
      if (route.request().method() === 'DELETE') {
        route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'server error' }) });
      } else {
        route.continue();
      }
    });

    await page.goto('/team');
    const removeBtn = page.getByRole('button', { name: /remove/i }).first();
    await removeBtn.click();
    await page.getByRole('button', { name: /confirm/i }).click();
    await expect(page.getByTestId('remove-member-error-toast')).toBeVisible({ timeout: 3000 });
  });
});
