// BUG-245: shell brand and topbar title should have testids.
import { test, expect } from '../../fixtures';

test.describe('Shell brand testids', () => {
  test('sidenav brand has testids', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.goto('/dashboard');
    await expect(page.getByTestId('sidenav-brand')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('sidenav-brand-name')).toContainText('Upper Room');
  });
});
