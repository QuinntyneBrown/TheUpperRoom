// BUG-010: design frame PEnbv shows the no-access page with a prominent
// lock icon above the heading. The current implementation has no icon.
import { test, expect } from '../../fixtures';

test.describe('No-access page lock icon', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/no-access');
    await expect(page.getByTestId('no-access-heading')).toBeVisible({ timeout: 5000 });
  });

  test('shows a lock mat-icon above the heading', async ({ page }) => {
    const icon = page.getByTestId('no-access-icon');
    await expect(icon).toBeVisible();
    await expect(icon).toHaveText('lock');
  });
});
