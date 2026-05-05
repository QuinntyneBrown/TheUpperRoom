// Traces to: 16 — Move Partner Through Funnel Stages
// L2-017: stage switcher persists, history renders, realtime updates
import { test, expect } from '../../fixtures';

test.describe('Partner Funnel', () => {
  test('partner detail page loads at /partners/:id', async ({ page }) => {
    await page.goto('/partners/00000000-0000-0000-0000-000000000001');
    await expect(page.locator('body')).toBeVisible();
  });

  test.fixme('stage switcher changes partner stage and shows in history', async ({ page, partners }) => {
    // Requires authenticated session with seeded partner
  });

  test.fixme('second connected client sees stage change within 2s', async ({ page, partners }) => {
    // Requires two concurrent WebSocket sessions — integration test
  });
});
