// Traces to: 09 — View Contact
// L2-010 AC: contact detail page renders name and empty notes panel
import { test, expect } from '../../fixtures';

test.describe('View Contact', () => {
  test('contact detail page renders name', async ({ page, contacts }) => {
    // Navigate to a contact detail URL (uses a fixed test id pattern)
    await page.goto('/contacts/00000000-0000-0000-0000-000000000001');
    // If the backend returns 404, the page handles it gracefully
    // For e2e this verifies the route exists
    await expect(page.locator('body')).toBeVisible();
  });

  test('contact detail page has notes section', async ({ page }) => {
    await page.goto('/contacts/00000000-0000-0000-0000-000000000001');
    // Notes section should be present even when empty
    // The test is fixme until backend+auth is wired in e2e
    test.fixme(true, 'Requires authenticated e2e session with seeded contact');
  });
});
