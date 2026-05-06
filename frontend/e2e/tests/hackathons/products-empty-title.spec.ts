// BUG-042: the hackathon products-section empty-state title is a <p>;
// promote to <h3> for correct heading semantics. Uses h3 (not h2)
// because the section already has its own <h2>Products</h2>.
import { test, expect } from '../../fixtures';

test.describe('Products-section empty title element', () => {
  test.beforeEach(async ({ page, auth }) => {
    await auth.signInAs('city-lead');

    const hackathon = {
      id: 'h-empty', title: 'Empty Hack', hostCity: 'Toronto',
      startDate: '2026-06-01', endDate: '2026-06-03',
      stage: 'Discover', products: [], partners: [], history: [], deletedAt: null,
    };
    await page.route('**/api/hackathons/h-empty', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(hackathon) });
      } else { route.continue(); }
    });

    await page.goto('/hackathons/h-empty');
    await expect(page.getByTestId('products-section-empty')).toBeVisible({ timeout: 5000 });
  });

  test('"No products yet." is rendered as an h3', async ({ page }) => {
    const title = page.getByTestId('products-empty-title');
    await expect(title).toHaveJSProperty('tagName', 'H3');
    await expect(title).toHaveText('No products yet.');
  });
});
