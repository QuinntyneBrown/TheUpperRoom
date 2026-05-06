// BUG-078: partners-board per-column empty state is a plain <div>.
// Promote to <h3> for heading semantics. Adds per-stage testid.
import { test, expect } from '../../fixtures';

test.describe('Partners-board column empty title', () => {
  test('"No partners yet" is rendered as an h3', async ({ page }) => {
    await page.route('**/api/partners*', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: '[]',
    }));
    await page.goto('/partners/board');
    await expect(page.getByTestId('partner-board')).toBeVisible({ timeout: 10000 });

    const lead = page.getByTestId('board-empty-Lead');
    await expect(lead).toHaveJSProperty('tagName', 'H3');
    await expect(lead).toHaveText('No partners yet');
  });
});
