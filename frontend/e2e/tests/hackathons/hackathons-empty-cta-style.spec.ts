// BUG-026: the hackathon-list empty-state "Create first hackathon" CTA
// uses mat-stroked-button. Switch to ur-button (brand primary) so the
// empty-state primary action matches the styling used for every other
// primary CTA in the app (mirrors BUG-007/008/010/024/025).
import { test, expect } from '../../fixtures';

test.describe('Hackathons empty-state CTA uses brand primary', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/hackathons*', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: '[]',
    }));
    await page.goto('/hackathons');
    await expect(page.getByTestId('hackathons-empty')).toBeVisible({ timeout: 10000 });
  });

  test('"Create first hackathon" button is a ur-button', async ({ page }) => {
    const btn = page.getByTestId('hackathons-empty-create-btn');
    await expect(btn).toHaveJSProperty('tagName', 'UR-BUTTON');
  });
});
