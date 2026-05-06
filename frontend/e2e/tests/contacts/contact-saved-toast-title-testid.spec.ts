// BUG-204: contact-saved-toast title <span> lacks testid. Mirrors
// BUG-202/203 toast-title testids.
import { test, expect } from '../../fixtures';

test.describe('Contact-saved toast title testid', () => {
  test('title span has testid contact-saved-toast-title', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/contacts/c1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'c1', teamId: 't1', firstName: 'Sam', lastName: 'Reyes', version: 1, notes: [],
      }),
    }));
    await page.goto('/contacts/c1?saved=1');
    await expect(page.getByTestId('contact-saved-toast')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('contact-saved-toast-title')).toBeVisible();
  });
});
