// BUG-128: contact-create page h1 "New contact" has no testid while
// sibling content uses testids extensively. Mirrors heading-testid
// pattern.
import { test, expect } from '../../fixtures';

test.describe('Contact create title testid', () => {
  test('"New contact" h1 has testid contact-create-title', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.goto('/contacts/new');

    const title = page.getByTestId('contact-create-title');
    await expect(title).toBeVisible({ timeout: 10000 });
    await expect(title).toHaveJSProperty('tagName', 'H1');
    await expect(title).toHaveText('New contact');
  });
});
