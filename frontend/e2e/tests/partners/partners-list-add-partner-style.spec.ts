// BUG-025: design frame M1XBkr shows the partner-list "+ Add partner"
// CTA as a filled brand-primary button. The current implementation
// uses mat-raised-button. Switch to the existing ur-button (mirrors
// BUG-007/008/010/024).
import { test, expect } from '../../fixtures';

test.describe('Partner-list "+ Add partner" CTA uses brand primary', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/partners*', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: '[]',
    }));
    await page.goto('/partners');
    await expect(page.getByTestId('new-partner-btn')).toBeVisible({ timeout: 10000 });
  });

  test('"+ Add partner" button is a ur-button', async ({ page }) => {
    const btn = page.getByTestId('new-partner-btn');
    await expect(btn).toHaveJSProperty('tagName', 'UR-BUTTON');
  });
});
