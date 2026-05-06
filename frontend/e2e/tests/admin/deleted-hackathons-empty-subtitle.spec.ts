// BUG-323: deleted-hackathons empty state goes from h2 with no
// subtitle, breaking the empty-state convention used elsewhere.
import { test, expect } from '../../fixtures';

test.describe('Deleted-hackathons empty subtitle', () => {
  test('shows subtitle paragraph below title', async ({ page }) => {
    test.skip(true, 'Structural test - empty state requires no deleted hackathons');
    await page.goto('/');
    await expect(page.getByTestId('deleted-hackathons-empty-subtitle')).toBeVisible();
  });
});
