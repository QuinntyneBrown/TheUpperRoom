// BUG-126: contact-edit page h1 "Edit contact" has no testid while
// sibling content uses testids extensively. Mirrors the heading-testid
// pattern from BUG-094/099/108..117.
import { test, expect } from '../../fixtures';

test.describe('Contact edit title testid', () => {
  test('"Edit contact" h1 has testid contact-edit-title', async ({ page }) => {
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
    await page.goto('/contacts/c1/edit');

    const title = page.getByTestId('contact-edit-title');
    await expect(title).toBeVisible({ timeout: 10000 });
    await expect(title).toHaveJSProperty('tagName', 'H1');
    await expect(title).toHaveText('Edit contact');
  });
});
