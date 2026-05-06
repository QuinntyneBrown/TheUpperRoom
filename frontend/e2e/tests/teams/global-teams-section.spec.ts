// BUG-304: global-teams-page wrapper should be section with aria-labelledby.
import { test, expect } from '../../fixtures';

test.describe('Global teams page section', () => {
  test('wrapper is section with aria-labelledby', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['NationalLead'] }),
    }));
    await page.route('**/api/teams**', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ items: [], total: 0 }),
    }));
    await page.goto('/teams');
    const section = page.getByTestId('global-teams-page');
    await expect(section).toBeVisible({ timeout: 10000 });
    const tag = await section.evaluate(el => el.tagName.toLowerCase());
    expect(tag).toBe('section');
    await expect(section).toHaveAttribute('aria-labelledby', 'global-teams-title');
  });
});
