// BUG-217: global-team-load-error message <span> lacks testid.
import { test, expect } from '../../fixtures';

test.describe('Global-team load-error message testid', () => {
  test('error message has testid global-team-load-error-message', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['Admin'] }),
    }));
    await page.route('**/api/teams/t1', (r) => r.fulfill({
      status: 500, contentType: 'application/json', body: '{}',
    }));
    await page.goto('/teams/t1');
    await expect(page.getByTestId('global-team-load-error')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('global-team-load-error-message')).toBeVisible();
  });
});
