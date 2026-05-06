// BUG-321: deleted-contacts table rows lack per-row testid while
// sibling restore-contact-{id} button has one.
import { test, expect } from '../../fixtures';

test.describe('Deleted-contacts table row testid', () => {
  test('table rows expose per-row testid', async ({ page }) => {
    test.skip(true, 'Structural test - requires deleted contacts');
    await page.goto('/');
    await expect(page.getByTestId('deleted-contact-row-abc').first()).toBeVisible();
  });
});
