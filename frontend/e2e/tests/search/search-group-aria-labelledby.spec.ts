// BUG-269: search overlay group section should have aria-labelledby.
import { test, expect } from '../../fixtures';

test.describe('Search group aria-labelledby', () => {
  test('group section has aria-labelledby pointing to its label heading', async ({ page }) => {
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
    await page.goto('/');
    await page.getByTestId('global-search-trigger').click();
    await page.getByTestId('search-input').fill('sam');
    const section = page.locator('section.search-overlay__group').first();
    await expect(section).toBeVisible({ timeout: 10000 });
    const labelledBy = await section.getAttribute('aria-labelledby');
    expect(labelledBy).toBeTruthy();
    if (labelledBy) {
      await expect(page.locator(`#${labelledBy}`)).toBeVisible();
    }
  });
});
