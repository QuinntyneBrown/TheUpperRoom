// BUG-111: design shows required fields with "*" suffix in the label.
// ur-input has a `required` boolean input but doesn't render any
// indicator, so users can't tell required from optional.
import { test, expect } from '../../fixtures';

test.describe('ur-input required indicator', () => {
  test('contact-form first-name label shows a required asterisk', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/contacts**', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ rows: [], total: 0, page: 1, pageSize: 20 }),
    }));
    await page.goto('/contacts/new');

    // Label "First name" is required → must include '*' indicator near it.
    const firstNameLabel = page.locator('.ur-input__label', { hasText: /^First name/ });
    await expect(firstNameLabel).toBeVisible({ timeout: 5000 });
    await expect(firstNameLabel.locator('.ur-input__required')).toBeVisible();
    await expect(firstNameLabel.locator('.ur-input__required')).toHaveText('*');

    // Optional field "Phone" should NOT show the indicator.
    const phoneLabel = page.locator('.ur-input__label', { hasText: /^Phone/ });
    await expect(phoneLabel).toBeVisible();
    await expect(phoneLabel.locator('.ur-input__required')).toHaveCount(0);
  });
});
