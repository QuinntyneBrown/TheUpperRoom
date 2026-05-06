// BUG-051: design frame bFXfn shows "Browse all contacts" and "Browse
// all partners" CTAs at the bottom of the global-search no-results
// state. Implementation has neither.
import { test, expect } from '../../fixtures';

test.describe('Global search no-results browse-all CTAs', () => {
  test.beforeEach(async ({ page, auth }) => {
    await auth.signInAs('city-lead');

    await page.route('**/api/search*', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ contacts: [], partners: [], hackathons: [] }),
    }));

    await page.getByTestId('global-search-trigger').click();
    await page.getByTestId('search-input').fill('zzznonexistent');
    await expect(page.getByTestId('search-no-results')).toBeVisible({ timeout: 5000 });
  });

  test('"Browse all contacts" CTA navigates to /contacts', async ({ page }) => {
    const btn = page.getByTestId('search-browse-contacts-btn');
    await expect(btn).toBeVisible();
    await expect(btn).toContainText('Browse all contacts');

    await btn.click();
    await page.waitForURL(/\/contacts$/);
  });

  test('"Browse all partners" CTA navigates to /partners', async ({ page }) => {
    const btn = page.getByTestId('search-browse-partners-btn');
    await expect(btn).toBeVisible();
    await expect(btn).toContainText('Browse all partners');

    await btn.click();
    await page.waitForURL(/\/partners$/);
  });
});
