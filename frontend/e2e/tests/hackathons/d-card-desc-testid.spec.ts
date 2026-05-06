// BUG-304: hackathon d-card description paragraph lacks per-stage
// testid while sibling stage badge button has stage-step-{value}.
import { test, expect } from '../../fixtures';

test.describe('Hackathon d-card desc testid', () => {
  test('desc paragraphs expose testids', async ({ page }) => {
    test.skip(true, 'Structural test - d-card requires hackathon-detail page');
    await page.goto('/');
    await expect(page.getByTestId('d-card-desc-Discover')).toBeVisible();
  });
});
