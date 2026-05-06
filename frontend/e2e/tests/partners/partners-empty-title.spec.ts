// BUG-035: the partners empty-state title is a <p>; design uses a
// heading. Promote to <h2> for correct semantics (mirrors
// BUG-030/033/034).
import { test, expect } from '../../fixtures';

test.describe('Partners empty-state title element', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/partners*', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: '[]',
    }));
    await page.goto('/partners');
    await expect(page.getByTestId('partners-empty')).toBeVisible({ timeout: 10000 });
  });

  test('"No partners found." is rendered as an h2', async ({ page }) => {
    const title = page.getByTestId('partners-empty-title');
    await expect(title).toHaveJSProperty('tagName', 'H2');
    await expect(title).toHaveText('No partners found.');
  });
});
