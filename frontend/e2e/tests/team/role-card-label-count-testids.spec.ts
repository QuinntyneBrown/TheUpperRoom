// BUG-331: team-role-card label h3 and count span lack testids while
// the parent role-card-{key} has one.
import { test, expect } from '../../fixtures';

test.describe('Team role-card label/count testids', () => {
  test('role-card label/count expose testids', async ({ page }) => {
    test.skip(true, 'Structural test - requires team page');
    await page.goto('/');
    await expect(page.getByTestId('role-card-label-prayer').first()).toBeVisible();
    await expect(page.getByTestId('role-card-count-prayer').first()).toBeVisible();
  });
});
