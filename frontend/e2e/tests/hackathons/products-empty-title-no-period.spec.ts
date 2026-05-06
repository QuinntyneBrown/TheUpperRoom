// BUG-143: products-empty-title ends with a period; mirrors cross-
// feature strip from BUG-121/122/139/140/142.
import { test, expect } from '../../fixtures';

test.describe('Products empty title has no trailing period', () => {
  test('"No products yet" h3 has no trailing period', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/hackathons/h1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'h1', title: 'Spring Hack', startsOn: '2026-05-01', endsOn: '2026-05-03',
        hostCity: 'Toronto', partners: [], products: [], history: [], version: 1,
      }),
    }));
    await page.goto('/hackathons/h1');
    const title = page.getByTestId('products-empty-title');
    await expect(title).toBeVisible({ timeout: 10000 });
    const text = await title.textContent();
    expect(text?.trim().endsWith('.')).toBe(false);
  });
});
