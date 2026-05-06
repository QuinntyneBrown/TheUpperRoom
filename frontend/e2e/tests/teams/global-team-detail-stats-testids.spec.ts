// BUG-325: global-team-detail stats <dt>/<dd> lack testids while
// sibling global-team-city h1 exposes one.
import { test, expect } from '../../fixtures';

test.describe('Global-team-detail stats testids', () => {
  test('stat values expose testids', async ({ page }) => {
    test.skip(true, 'Structural test - requires global team detail');
    await page.goto('/');
    await expect(page.getByTestId('global-team-stat-members')).toBeVisible();
    await expect(page.getByTestId('global-team-stat-active-hackathons')).toBeVisible();
    await expect(page.getByTestId('global-team-stat-partners')).toBeVisible();
  });
});
