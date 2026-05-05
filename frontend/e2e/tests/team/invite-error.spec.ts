// Traces to: 26 — Invite Team Member
// L2-026: invite dialog shows error when invite API fails
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Invite team member error', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('shows error in invite dialog when API fails', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    await page.route('**/api/team/invite', (route) => {
      route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'server error' }) });
    });

    await page.goto('/team');
    await page.getByTestId('invite-member-button').click();
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByTestId('invite-role-CityLead').check();
    await page.getByTestId('send-invite-btn').click();
    await expect(page.getByTestId('invite-save-error')).toBeVisible({ timeout: 3000 });
  });
});
