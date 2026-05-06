// BUG-101: contact-not-found h1 "Contact not found" has no testid.
// Mirrors BUG-094/099 heading-testid pattern.
import { test, expect } from '../../fixtures';

test.describe('Contact not-found heading testid', () => {
  test('"Contact not found" h1 has testid contact-not-found-title', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/contacts/missing', (r) => r.fulfill({
      status: 404, contentType: 'application/json', body: '{}',
    }));
    await page.goto('/contacts/missing');
    await expect(page.getByTestId('contact-not-found')).toBeVisible({ timeout: 10000 });

    const title = page.getByTestId('contact-not-found-title');
    await expect(title).toHaveJSProperty('tagName', 'H1');
    await expect(title).toHaveText('Contact not found');
  });
});
