// BUG-133: deleted-hackathons h1 lacks testid and uses Title Case
// ("Deleted Hackathons") while peer page titles use sentence case.
// Mirrors BUG-130.
import { test, expect } from '../../fixtures';

test.describe('Deleted-hackathons page title', () => {
  test('"Deleted hackathons" h1 has testid and uses sentence case', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['Admin'] }),
    }));
    await page.route('**/api/hackathons/deleted**', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: '[]',
    }));
    await page.goto('/admin/deleted-hackathons');

    const title = page.getByTestId('deleted-hackathons-title');
    await expect(title).toBeVisible({ timeout: 10000 });
    await expect(title).toHaveJSProperty('tagName', 'H1');
    await expect(title).toHaveText('Deleted hackathons');
  });
});
