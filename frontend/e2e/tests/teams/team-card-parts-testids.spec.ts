// BUG-328: team-card parts (city/members/hackathons/partners) lack
// testids while the parent team-card-{id} has one.
import { test, expect } from '../../fixtures';

test.describe('Team-card parts testids', () => {
  test('team card parts expose testids', async ({ page }) => {
    test.skip(true, 'Structural test - requires populated teams list');
    await page.goto('/');
    await expect(page.getByTestId('team-card-city').first()).toBeVisible();
  });
});
