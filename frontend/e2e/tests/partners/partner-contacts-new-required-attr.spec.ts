// BUG-145: partner-contacts new-contact inputs (first/last) show
// "*" in placeholder but lack the HTML required attribute.
import { test, expect } from '../../fixtures';

test.describe('Partner-contacts new-contact required attr', () => {
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

  test('first name input has required attribute', async ({ page }) => {
    await expect(page.getByTestId('new-contact-first-name')).toHaveAttribute('required', '');
  });

  test('last name input has required attribute', async ({ page }) => {
    await expect(page.getByTestId('new-contact-last-name')).toHaveAttribute('required', '');
  });
});
