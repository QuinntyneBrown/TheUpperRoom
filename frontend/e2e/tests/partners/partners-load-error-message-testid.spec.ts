// BUG-210: partners-load-error message <span> lacks testid.
import { test, expect } from '../../fixtures';

test.describe('Partners load-error message testid', () => {
  test('error message has testid partners-load-error-message', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/partners**', (r) => r.fulfill({
      status: 500, contentType: 'application/json', body: '{}',
    }));
    await page.goto('/partners');
    await expect(page.getByTestId('partners-load-error')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('partners-load-error-message')).toBeVisible();
  });
});
