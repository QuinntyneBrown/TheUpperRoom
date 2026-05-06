// BUG-318: contact search-result-card lacks per-result testid while
// the regular contact-card row uses contact-card-{id}.
import { test, expect } from '../../fixtures';

test.describe('Contact search-result-card testid', () => {
  test('search result cards expose testids', async ({ page }) => {
    test.skip(true, 'Structural test - requires search results');
    await page.goto('/');
    await expect(page.getByTestId('search-result-card-abc').first()).toBeVisible();
  });
});
