// BUG-074: contact-form Cancel is rendered as <a routerLink>; the
// symmetrical partner-edit and hackathon-edit cancels use
// ur-button variant=ghost. Match for cross-feature consistency.
import { test, expect } from '../../fixtures';

test.describe('Contact-form cancel button style', () => {
  test('Cancel is rendered as ur-button on /contacts/new', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: 'u1', displayName: 'Quinn', email: 'q@example.com', roles: ['CityLead'] }),
    }));
    await page.goto('/contacts/new');
    const cancel = page.getByTestId('contact-create-cancel-btn');
    await expect(cancel).toBeVisible({ timeout: 10000 });
    await expect(cancel).toHaveJSProperty('tagName', 'UR-BUTTON');
  });
});
