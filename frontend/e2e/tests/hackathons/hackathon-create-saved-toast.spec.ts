// Traces to: T63 — create pages navigate with ?saved=1 so detail shows savedToast
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Hackathon create saved toast', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('navigating to detail with ?saved=1 shows saved toast', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    const hackathon = {
      id: 'h-saved1', title: 'Toast Hack', hostCity: 'Dublin',
      startDate: '2026-06-01', endDate: '2026-06-03',
      stage: 'Discover', products: [], partners: [], history: [], deletedAt: null,
    };
    await page.route('**/api/hackathons/h-saved1', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(hackathon) });
      } else { route.continue(); }
    });

    await page.goto('/hackathons/h-saved1?saved=1');
    await expect(page.getByTestId('hackathon-detail')).toBeVisible({ timeout: 3000 });
    await expect(page.getByTestId('hackathon-saved-toast')).toBeVisible({ timeout: 2000 });
  });

  test('saved toast disappears after a few seconds', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    const hackathon = {
      id: 'h-saved2', title: 'Toast Fade Hack', hostCity: 'Cork',
      startDate: '2026-06-01', endDate: '2026-06-03',
      stage: 'Discover', products: [], partners: [], history: [], deletedAt: null,
    };
    await page.route('**/api/hackathons/h-saved2', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(hackathon) });
      } else { route.continue(); }
    });

    await page.goto('/hackathons/h-saved2?saved=1');
    await expect(page.getByTestId('hackathon-saved-toast')).toBeVisible({ timeout: 2000 });
    await expect(page.getByTestId('hackathon-saved-toast')).not.toBeVisible({ timeout: 5000 });
  });
});
