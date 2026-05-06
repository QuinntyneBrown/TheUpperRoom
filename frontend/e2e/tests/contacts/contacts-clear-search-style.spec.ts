// BUG-040: contacts list no-results "Clear search" CTA uses
// mat-stroked-button. Switch to ur-button for brand consistency.
import { test, expect } from '../../fixtures';

test.describe('Contacts clear-search button', () => {
  test('clear-search button is rendered as ur-button', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/contacts**', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ rows: [], total: 0, page: 1, pageSize: 20 }),
    }));
    // Search endpoint returning empty results
    await page.route('**/api/contacts/search**', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify([]),
    }));
    await page.goto('/contacts');
    await expect(page.getByTestId('contact-search-input')).toBeVisible({ timeout: 10000 });
    await page.getByTestId('contact-search-input').fill('zzznoresults');
    await expect(page.getByTestId('search-no-results')).toBeVisible({ timeout: 5000 });
    await expect(page.getByTestId('search-clear-btn')).toHaveJSProperty('tagName', 'UR-BUTTON');
  });
});
