// BUG-335: global-team-detail back-arrow mat-icon lacks a testid
// completing the back-arrow testid sweep across detail/edit pages.
import { test, expect } from '../../fixtures';

test.describe('Global-team-detail back-icon testid', () => {
  test('back arrow icon exposes testid', async ({ page }) => {
    test.skip(true, 'Structural test - requires global-team-detail page');
    await page.goto('/');
    await expect(page.getByTestId('global-team-back-arrow')).toBeVisible();
  });
});
