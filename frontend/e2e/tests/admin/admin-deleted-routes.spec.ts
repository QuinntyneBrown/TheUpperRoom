// BUG-174: admin deleted-* routes must match the URLs tests use
// (/admin/deleted-contacts and /admin/deleted-hackathons).
import { test, expect } from '../../fixtures';

test.describe('Admin deleted-* routes', () => {
  test('/admin/deleted-contacts loads the page', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['Admin'] }),
    }));
    await page.route('**/api/admin/deleted-contacts', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: '[]',
    }));
    await page.goto('/admin/deleted-contacts');
    await expect(page.getByTestId('deleted-contacts-empty')).toBeVisible({ timeout: 10000 });
  });

  test('/admin/deleted-hackathons loads the page', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['Admin'] }),
    }));
    await page.route('**/api/admin/deleted-hackathons', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: '[]',
    }));
    await page.goto('/admin/deleted-hackathons');
    await expect(page.getByTestId('deleted-hackathons-empty')).toBeVisible({ timeout: 10000 });
  });
});
