// BUG-114: contacts-list h1 "Contacts" has no testid while sibling
// content uses testids extensively. Mirrors BUG-094/099/108..113.
import { test, expect } from '../../fixtures';

test.describe('Contacts list title testid', () => {
  test('"Contacts" h1 has testid contacts-list-title', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/contacts**', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ rows: [], total: 0, page: 1, pageSize: 20 }),
    }));
    await page.goto('/contacts');
    await expect(page.getByTestId('contacts-empty-title')).toBeVisible({ timeout: 10000 });

    const title = page.getByTestId('contacts-list-title');
    await expect(title).toHaveJSProperty('tagName', 'H1');
    await expect(title).toHaveText('Contacts');
  });
});
