// BUG-211: restore-error-toast message should have data-testid.
import { test, expect } from '../../fixtures';

test.describe('Restore error toast message testid', () => {
  test('deleted-contacts page restore-error-toast-message has testid', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/contacts/deleted', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify([
        { id: 'c1', name: 'Sam Reyes', deletedAt: '2026-04-01T12:00:00Z' },
      ]),
    }));
    await page.route('**/api/contacts/c1/restore', (r) => r.fulfill({ status: 500, body: '' }));
    await page.goto('/admin/deleted-contacts');
    await page.getByTestId('restore-contact-c1').click();
    await expect(page.getByTestId('restore-error-toast-message')).toBeVisible({ timeout: 10000 });
  });
});
