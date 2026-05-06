// BUG-027: the partner-list empty-state "Add first partner" CTA uses
// mat-stroked-button. Switch to ur-button (brand primary) so the
// primary empty-state action matches the styling used everywhere else
// (mirrors BUG-026 for hackathons).
import { test, expect } from '../../fixtures';

test.describe('Partners empty-state CTA uses brand primary', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/partners*', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: '[]',
    }));
    await page.goto('/partners');
    await expect(page.getByTestId('partners-empty')).toBeVisible({ timeout: 10000 });
  });

  test('"Add first partner" button is a ur-button', async ({ page }) => {
    const btn = page.getByTestId('partners-empty-create-btn');
    await expect(btn).toHaveJSProperty('tagName', 'UR-BUTTON');
  });
});
