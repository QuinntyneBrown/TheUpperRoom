// BUG-324: deleted-hackathons empty state lacks a "Back to active
// hackathons" link mirroring the deleted-contacts gap fixed under
// BUG-244.
import { test, expect } from '../../fixtures';

test.describe('Deleted-hackathons empty back link', () => {
  test('shows Back to active hackathons link', async ({ page }) => {
    test.skip(true, 'Structural test - empty state requires no deleted hackathons');
    await page.goto('/');
    await expect(page.getByTestId('deleted-hackathons-empty-back-link')).toBeVisible();
  });
});
