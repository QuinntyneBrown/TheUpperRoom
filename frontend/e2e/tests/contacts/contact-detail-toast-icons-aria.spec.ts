// BUG-083: contact-detail toast icons inside role="alert" /
// role="status" containers lack aria-hidden="true". Mirrors
// BUG-080/081/082.
import { test, expect } from '../../fixtures';

const CONTACT = {
  id: 'c1',
  firstName: 'Sam',
  lastName: 'Reyes',
  email: 'sam@example.com',
  phone: null,
  city: 'Toronto',
  notes: [],
};

test.describe('Contact-detail toast icons are aria-hidden', () => {
  test('contact-saved-toast icon has aria-hidden="true"', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: 'u1', displayName: 'Quinn', email: 'q@example.com', roles: ['CityLead'] }),
    }));
    await page.route('**/api/contacts/c1', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: JSON.stringify(CONTACT),
    }));

    // Use the saved=1 query param to trigger the saved toast on load
    await page.goto('/contacts/c1?saved=1');
    await expect(page.getByTestId('contact-saved-toast')).toBeVisible({ timeout: 10000 });

    const icon = page.locator('[data-testid="contact-saved-toast"] mat-icon');
    await expect(icon).toHaveAttribute('aria-hidden', 'true');
  });
});
