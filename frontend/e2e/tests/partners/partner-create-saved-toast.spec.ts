// Traces to: T63 — create pages navigate with ?saved=1 so detail shows savedToast
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Partner create saved toast', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('navigating to detail with ?saved=1 shows saved toast', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    const partner = {
      id: 'p-saved1', name: 'Toast Church', city: 'Dublin',
      stage: 'Lead', contacts: [], history: [], notes: [], deletedAt: null,
    };
    await page.route('**/api/partners/p-saved1', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(partner) });
      } else { route.continue(); }
    });

    await page.goto('/partners/p-saved1?saved=1');
    await expect(page.getByTestId('partner-detail')).toBeVisible({ timeout: 3000 });
    await expect(page.getByTestId('partner-saved-toast')).toBeVisible({ timeout: 2000 });
  });

  test('saved toast disappears after a few seconds', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    const partner = {
      id: 'p-saved2', name: 'Toast Fade Church', city: 'Cork',
      stage: 'Lead', contacts: [], history: [], notes: [], deletedAt: null,
    };
    await page.route('**/api/partners/p-saved2', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(partner) });
      } else { route.continue(); }
    });

    await page.goto('/partners/p-saved2?saved=1');
    await expect(page.getByTestId('partner-saved-toast')).toBeVisible({ timeout: 2000 });
    await expect(page.getByTestId('partner-saved-toast')).not.toBeVisible({ timeout: 5000 });
  });
});
