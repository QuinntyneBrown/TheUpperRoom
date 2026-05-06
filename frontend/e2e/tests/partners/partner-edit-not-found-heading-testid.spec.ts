// BUG-116: partner-edit not-found heading lacks a data-testid.
// Add 'partner-edit-not-found-title' to mirror the testability of
// the detail page's not-found heading.
import { test, expect } from '../../fixtures';

test.describe('partner-edit not-found heading testid', () => {
  test('renders heading with data-testid="partner-edit-not-found-title"', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/partners/p-missing', (r) => r.fulfill({
      status: 404, contentType: 'application/json', body: '{}',
    }));
    await page.goto('/partners/p-missing/edit');
    await expect(page.getByTestId('partner-edit-not-found')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('partner-edit-not-found-title')).toHaveText(/Partner not found/);
  });
});
