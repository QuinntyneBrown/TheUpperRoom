// BUG-113: hackathons-list h1 "Hackathons" has no testid while
// sibling content uses testids extensively. Mirrors BUG-094/099/108..112.
import { test, expect } from '../../fixtures';

test.describe('Hackathons list title testid', () => {
  test('"Hackathons" h1 has testid hackathons-list-title', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/hackathons**', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: '[]',
    }));
    await page.goto('/hackathons');
    await expect(page.getByTestId('hackathons-empty')).toBeVisible({ timeout: 10000 });

    const title = page.getByTestId('hackathons-list-title');
    await expect(title).toHaveJSProperty('tagName', 'H1');
    await expect(title).toHaveText('Hackathons');
  });
});
