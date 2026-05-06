// BUG-029: design frame FZmxK shows the confirm button as "Delete
// Sam Reyes" with the contact name. Implementation has the static
// "Delete contact". Reuses the dialog data already piped through for
// the title fix in BUG-020.
import { test, expect } from '../../fixtures';

test.describe('Delete contact dialog button label', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead', 'Admin'] }),
    }));
    await page.route('**/api/contacts/c1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'c1', teamId: 't1', firstName: 'Sam', lastName: 'Reyes', version: 1, notes: [],
      }),
    }));
    await page.goto('/contacts/c1');
    await expect(page.getByTestId('contact-more-btn')).toBeVisible({ timeout: 10000 });
    await page.getByTestId('contact-more-btn').click();
    await page.getByTestId('contact-delete-menu-item').click();
    await expect(page.getByTestId('contact-delete-dialog')).toBeVisible();
  });

  test('confirm button reads "Delete Sam Reyes"', async ({ page }) => {
    await expect(page.getByTestId('confirm-delete-contact-btn')).toContainText('Delete Sam Reyes');
  });
});
