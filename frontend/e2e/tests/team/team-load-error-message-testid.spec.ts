// BUG-213: team-load-error message <span> lacks testid.
import { test, expect } from '../../fixtures';

test.describe('Team load-error message testid', () => {
  test('error message has testid team-load-error-message', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/team/local**', (r) => r.fulfill({
      status: 500, contentType: 'application/json', body: '{}',
    }));
    await page.goto('/team');
    await expect(page.getByTestId('team-load-error')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('team-load-error-message')).toBeVisible();
  });
});
