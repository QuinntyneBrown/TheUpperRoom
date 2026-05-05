// Traces to: T65 — remove member dialog data-testid + success toast
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Remove member dialog testids', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('remove button opens dialog with data-testid', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    const member = { id: 'm1', displayName: 'Alice Smith', email: 'alice@example.com', roles: [], isActive: true };
    await page.route('**/api/team/members', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([member]) });
      } else { route.continue(); }
    });

    await page.goto('/team');
    await expect(page.getByTestId('local-team-page')).toBeVisible({ timeout: 3000 });

    await page.getByRole('button', { name: /remove/i }).first().click();
    await expect(page.getByTestId('remove-member-dialog')).toBeVisible({ timeout: 2000 });
    await expect(page.getByTestId('confirm-remove-btn')).toBeVisible();
  });

  test('successful remove shows success toast', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    const members = [{ id: 'm2', displayName: 'Bob Jones', email: 'bob@example.com', roles: [], isActive: true }];
    await page.route('**/api/team/members', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(members) });
      } else { route.continue(); }
    });
    await page.route('**/api/team/members/m2', (route) => {
      if (route.request().method() === 'DELETE') {
        route.fulfill({ status: 204 });
      } else { route.continue(); }
    });

    await page.goto('/team');
    await expect(page.getByTestId('local-team-page')).toBeVisible({ timeout: 3000 });
    await page.getByRole('button', { name: /remove/i }).first().click();
    await page.getByTestId('confirm-remove-btn').click();
    await expect(page.getByTestId('remove-member-success-toast')).toBeVisible({ timeout: 3000 });
  });
});
