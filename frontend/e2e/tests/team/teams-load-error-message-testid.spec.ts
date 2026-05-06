// BUG-214: teams-load-error message <span> lacks testid.
import { test, expect } from '../../fixtures';

test.describe('Teams (global) load-error message testid', () => {
  test('error message has testid teams-load-error-message', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['Admin'] }),
    }));
    await page.route('**/api/teams**', (r) => r.fulfill({
      status: 500, contentType: 'application/json', body: '{}',
    }));
    await page.goto('/teams');
    await expect(page.getByTestId('teams-load-error')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('teams-load-error-message')).toBeVisible();
  });
});
