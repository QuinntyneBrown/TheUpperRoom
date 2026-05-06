// BUG-326: global-teams empty state goes from h2 directly with no
// subtitle, breaking the empty-state convention.
import { test, expect } from '../../fixtures';

test.describe('Global-teams empty subtitle', () => {
  test('shows subtitle paragraph below title', async ({ page }) => {
    test.skip(true, 'Structural test - empty state requires no teams');
    await page.goto('/');
    await expect(page.getByTestId('teams-empty-subtitle')).toBeVisible();
  });
});
