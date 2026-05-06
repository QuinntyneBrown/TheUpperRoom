// BUG-218: deleted-hackathons-load-error message <span> lacks testid.
import { test, expect } from '../../fixtures';

test.describe('Deleted-hackathons load-error message testid', () => {
  test('error message has testid deleted-hackathons-load-error-message', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['Admin'] }),
    }));
    await page.route('**/api/hackathons/deleted**', (r) => r.fulfill({
      status: 500, contentType: 'application/json', body: '{}',
    }));
    await page.goto('/admin/deleted-hackathons');
    await expect(page.getByTestId('deleted-hackathons-error')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('deleted-hackathons-load-error-message')).toBeVisible();
  });
});
