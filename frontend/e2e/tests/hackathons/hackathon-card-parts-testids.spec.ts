// BUG-315: hackathon-card title and meta spans lack testids while
// sibling stage badge has hackathon-stage-badge.
import { test, expect } from '../../fixtures';

test.describe('Hackathon-card parts testids', () => {
  test('hackathon card parts expose testids', async ({ page }) => {
    test.skip(true, 'Structural test - requires populated hackathons list');
    await page.goto('/');
    await expect(page.getByTestId('hackathon-card-title').first()).toBeVisible();
    await expect(page.getByTestId('hackathon-card-meta').first()).toBeVisible();
  });
});
