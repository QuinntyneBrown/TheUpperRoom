// BUG-230: hackathon-edit error spans should have data-testid.
import { test, expect } from '../../fixtures';

test.describe('Hackathon edit error testids', () => {
  test('title error renders with stable testid', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/partners', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: '[]',
    }));
    await page.route('**/api/hackathons/h1', (r) => {
      if (r.request().method() === 'PUT') {
        return r.fulfill({
          status: 422, contentType: 'application/json',
          body: JSON.stringify({ errors: { title: 'Title is required' } }),
        });
      }
      return r.fulfill({
        status: 200, contentType: 'application/json',
        body: JSON.stringify({
          id: 'h1', title: 'Old', hostCity: 'Toronto',
          startDate: '2026-05-01', endDate: '2026-05-03', stage: 'Discover',
          products: [], partners: [], history: [], version: 1,
        }),
      });
    });
    await page.goto('/hackathons/h1/edit');
    await page.locator('#editTitle').fill('');
    await page.getByTestId('hackathon-edit-save-btn').click();
    await expect(page.getByTestId('hackathon-edit-title-error')).toBeVisible({ timeout: 10000 });
  });
});
