// BUG-115: hackathon-edit not-found heading lacks a data-testid
// while the detail page heading has 'hackathon-not-found-title'.
// Add a matching testid for testability.
import { test, expect } from '../../fixtures';

test.describe('hackathon-edit not-found heading testid', () => {
  test('renders heading with data-testid="hackathon-edit-not-found-title"', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/hackathons/h-missing', (r) => r.fulfill({
      status: 404, contentType: 'application/json', body: '{}',
    }));
    await page.goto('/hackathons/h-missing/edit');
    await expect(page.getByTestId('hackathon-edit-not-found')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('hackathon-edit-not-found-title')).toHaveText(/Hackathon not found/);
  });
});
