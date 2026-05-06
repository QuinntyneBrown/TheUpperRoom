// BUG-244: shell section labels should have data-testid.
import { test, expect } from '../../fixtures';

test.describe('Sidenav section labels testid', () => {
  test('workspace and global section labels have testids', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.goto('/dashboard');
    await expect(page.getByTestId('sidenav-workspace-label')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('sidenav-global-label')).toBeVisible();
  });
});
