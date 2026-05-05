// Traces to: Hackathon detail page — stage change success feedback
// T57: changing hackathon stage shows a success toast
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Hackathon stage success toast', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('shows success toast after changing stage', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    const hackathon = {
      id: 'h1', title: 'Spring Hack', hostCity: 'Toronto',
      startDate: '2026-06-01', endDate: '2026-06-03',
      stage: 'Discover', products: [], partners: [], history: [],
    };

    await page.route('**/api/hackathons/h1', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(hackathon) });
      } else {
        route.continue();
      }
    });

    await page.route('**/api/hackathons/h1/stage', (route) => {
      if (route.request().method() === 'PUT' || route.request().method() === 'PATCH' || route.request().method() === 'POST') {
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ...hackathon, stage: 'Define' }) });
      } else {
        route.continue();
      }
    });

    await page.goto('/hackathons/h1');
    await expect(page.getByTestId('hackathon-detail')).toBeVisible({ timeout: 3000 });

    await page.getByTestId('stage-step-Define').click();
    await expect(page.getByTestId('hackathon-stage-success-toast')).toBeVisible({ timeout: 3000 });
  });
});
