// BUG-243: shell side-nav items should expose stable testids.
import { test, expect } from '../../fixtures';

test.describe('Shell side-nav testids', () => {
  test('workspace nav items have stable testids', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.goto('/dashboard');
    await expect(page.getByTestId('nav-partners')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('nav-hackathons')).toBeVisible();
    await expect(page.getByTestId('nav-team')).toBeVisible();
  });
});
