// BUG-229: hackathon-create error spans should have data-testid.
import { test, expect } from '../../fixtures';

test.describe('Hackathon create error testids', () => {
  test('title error renders with stable testid', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/partners', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: '[]',
    }));
    await page.route('**/api/hackathons', (r) => {
      if (r.request().method() === 'POST') {
        return r.fulfill({
          status: 422, contentType: 'application/json',
          body: JSON.stringify({ errors: { title: 'Title is required' } }),
        });
      }
      return r.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
    });
    await page.goto('/hackathons/new');
    await page.getByTestId('plan-hackathon-btn').click();
    await expect(page.getByTestId('hackathon-create-title-error')).toBeVisible({ timeout: 10000 });
  });
});
