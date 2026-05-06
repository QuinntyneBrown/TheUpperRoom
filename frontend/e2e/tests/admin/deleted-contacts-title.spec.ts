// BUG-130: deleted-contacts h1 lacks testid and uses Title Case
// ("Deleted Contacts") while peer page titles are sentence case
// ("Hackathons", "Partners", "Team", "Contacts", "Dashboard").
import { test, expect } from '../../fixtures';

test.describe('Deleted-contacts page title', () => {
  test('"Deleted contacts" h1 has testid and uses sentence case', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['Admin'] }),
    }));
    await page.route('**/api/contacts/deleted**', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: '[]',
    }));
    await page.goto('/admin/deleted-contacts');

    const title = page.getByTestId('deleted-contacts-title');
    await expect(title).toBeVisible({ timeout: 10000 });
    await expect(title).toHaveJSProperty('tagName', 'H1');
    await expect(title).toHaveText('Deleted contacts');
  });
});
