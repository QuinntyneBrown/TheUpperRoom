// BUG-212: hackathons-load-error message <span> lacks testid.
import { test, expect } from '../../fixtures';

test.describe('Hackathons load-error message testid', () => {
  test('error message has testid hackathons-load-error-message', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/hackathons**', (r) => r.fulfill({
      status: 500, contentType: 'application/json', body: '{}',
    }));
    await page.goto('/hackathons');
    await expect(page.getByTestId('hackathons-error')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('hackathons-load-error-message')).toBeVisible();
  });
});
