// BUG-024: design frame QYgpt shows the partners-board "New partner"
// CTA as a filled brand-primary button (same CJdjz ref used by every
// other primary CTA). The current implementation uses
// mat-raised-button. Switch to the existing ur-button.
import { test, expect } from '../../fixtures';

test.describe('Partners-board "New partner" CTA uses brand primary', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/partners*', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: '[]',
    }));
    await page.goto('/partners/board');
    await expect(page.getByTestId('partner-board')).toBeVisible({ timeout: 10000 });
  });

  test('"New partner" button is a ur-button', async ({ page }) => {
    const btn = page.getByTestId('create-partner-button');
    await expect(btn).toHaveJSProperty('tagName', 'UR-BUTTON');
  });
});
