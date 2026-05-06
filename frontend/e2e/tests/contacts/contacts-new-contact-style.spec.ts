// BUG-008: design frame uZess shows the "+ New contact" button as a
// filled brand-purple primary, matching the sign-in / dashboard
// "+ Add widget" treatment. The implementation uses mat-raised-button
// which renders as outlined text-style on this dark theme.
import { test, expect } from '../../fixtures';

test.describe('Contacts new-contact button uses brand primary', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['city-lead'] }),
    }));
    await page.route('**/api/contacts**', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ rows: [], total: 0, page: 1, pageSize: 20 }),
    }));
    await page.goto('/contacts');
    await expect(page.getByTestId('new-contact-btn')).toBeVisible({ timeout: 10000 });
  });

  test('new-contact button is a ur-button', async ({ page }) => {
    await expect(page.getByTestId('new-contact-btn')).toHaveJSProperty('tagName', 'UR-BUTTON');
  });
});
