// BUG-007: design frame PEnbv shows the no-access page with heading
// "Access denied" (lowercase d) and a 403 subtitle line.
import { test, expect } from '../../fixtures';

test.describe('No-access page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/no-access');
    await expect(page.getByTestId('no-access-heading')).toBeVisible({ timeout: 5000 });
  });

  test('heading reads "Access denied"', async ({ page }) => {
    await expect(page.getByTestId('no-access-heading')).toHaveText('Access denied');
  });

  test('shows the 403 subtitle line', async ({ page }) => {
    await expect(page.getByTestId('no-access-code')).toHaveText(
      "403 · You don't have permission to view this page"
    );
  });
});
