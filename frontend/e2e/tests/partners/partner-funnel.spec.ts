// Traces to: 16 — Move Partner Through Funnel Stages
// L2-017: stage switcher persists, history renders, realtime updates
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Partner Funnel', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('partner detail page shows stage advance button', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    const partner = { id: 'p-funnel1', name: 'Funnel Partner', city: 'Dublin', stage: 'Lead', website: '', description: '', contacts: [], deletedAt: null };
    await page.route('**/api/partners/p-funnel1', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(partner) });
    });

    await page.goto('/partners/p-funnel1');
    await expect(page.getByTestId('stage-advance-btn')).toBeVisible({ timeout: 3000 });
  });

  test.fixme('stage switcher changes partner stage and shows in history', async ({ page, partners }) => {
    // Requires authenticated session with seeded partner
  });

  test.fixme('second connected client sees stage change within 2s', async ({ page, partners }) => {
    // Requires two concurrent WebSocket sessions — integration test
  });
});
