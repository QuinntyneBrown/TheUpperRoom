// BUG-036: the hackathons empty-state title is a <p>; design uses a
// heading. Promote to <h2> for correct semantics (mirrors
// BUG-030/033/034/035).
import { test, expect } from '../../fixtures';

test.describe('Hackathons empty-state title element', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/hackathons*', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: '[]',
    }));
    await page.goto('/hackathons');
    await expect(page.getByTestId('hackathons-empty')).toBeVisible({ timeout: 10000 });
  });

  test('"No hackathons yet." is rendered as an h2', async ({ page }) => {
    const title = page.getByTestId('hackathons-empty-title');
    await expect(title).toHaveJSProperty('tagName', 'H2');
    await expect(title).toHaveText('No hackathons yet.');
  });
});
