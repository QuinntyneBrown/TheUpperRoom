// BUG-042: admin tables' Restore action buttons use mat-button.
// Switch to ur-button (representative test on deleted-contacts page).
import { test, expect } from '../../fixtures';

test.describe('Admin Restore button style', () => {
  test('deleted-contact Restore is rendered as ur-button', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['Admin'] }),
    }));
    await page.route('**/api/admin/contacts/deleted', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify([
        { id: 'c1', firstName: 'Sam', lastName: 'Reyes', deletedAt: '2026-05-01T00:00:00Z' },
      ]),
    }));
    await page.goto('/admin/contacts/deleted');
    await expect(page.getByTestId('restore-contact-c1')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('restore-contact-c1')).toHaveJSProperty('tagName', 'UR-BUTTON');
  });
});
