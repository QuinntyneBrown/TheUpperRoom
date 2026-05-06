// BUG-154: search group h3 labels lack a testid; sibling section-count
// uses a per-group testid. Mirrors the per-group testid pattern.
import { test, expect } from '../../fixtures';

test.describe('Global search group-label testid', () => {
  test('h3 group label has testid section-title-{group}', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/search**', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        contacts: [{ id: 'c1', label: 'Sam Reyes', type: 'contact' }],
        partners: [],
        hackathons: [],
      }),
    }));

    await page.goto('/dashboard');
    await page.getByTestId('global-search-trigger').click();
    await page.getByTestId('search-input').fill('sam');
    await expect(page.getByTestId('search-results')).toBeVisible({ timeout: 5000 });

    const title = page.getByTestId('section-title-Contacts');
    await expect(title).toBeVisible();
    await expect(title).toHaveJSProperty('tagName', 'H3');
  });
});
