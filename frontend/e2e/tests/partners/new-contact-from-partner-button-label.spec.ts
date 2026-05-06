// BUG-101: design frame W4ieIT shows the new-contact-from-partner
// submit button labelled "Create & link contact". Implementation
// says "Create & link".
import { test, expect } from '../../fixtures';

test.describe('New-contact-from-partner submit label', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/partners/p1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'p1', name: 'Mountain Top Church', city: 'Toronto', stage: 'Lead',
        contacts: [], notes: [], history: [], version: 1,
      }),
    }));
    await page.goto('/partners/p1');
    await expect(page.getByTestId('add-contact-btn')).toBeVisible({ timeout: 10000 });
    await page.getByTestId('add-contact-btn').click();
    await expect(page.getByTestId('new-contact-form')).toBeVisible();
  });

  test('submit button reads "Create & link contact"', async ({ page }) => {
    const btn = page.getByTestId('create-link-btn');
    await expect(btn).toContainText(/Create\s*&\s*link\s+contact/i);
  });
});
