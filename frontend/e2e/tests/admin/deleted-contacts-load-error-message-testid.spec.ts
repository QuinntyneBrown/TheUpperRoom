// BUG-219: deleted-contacts-load-error message <span> lacks testid.
import { test, expect } from '../../fixtures';

test.describe('Deleted-contacts load-error message testid', () => {
  test('error message has testid deleted-contacts-load-error-message', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['Admin'] }),
    }));
    await page.route('**/api/contacts/deleted**', (r) => r.fulfill({
      status: 500, contentType: 'application/json', body: '{}',
    }));
    await page.goto('/admin/deleted-contacts');
    await expect(page.getByTestId('deleted-contacts-error')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('deleted-contacts-load-error-message')).toBeVisible();
  });
});
