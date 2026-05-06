// BUG-330: team-role-card member-name and member-email spans lack
// testids while the parent member-row-{id} has one.
import { test, expect } from '../../fixtures';

test.describe('Team member-name/email testids', () => {
  test('member-row name/email parts expose testids', async ({ page }) => {
    test.skip(true, 'Structural test - requires populated team');
    await page.goto('/');
    await expect(page.getByTestId('member-name').first()).toBeVisible();
    await expect(page.getByTestId('member-email').first()).toBeVisible();
  });
});
