// BUG-182: team-role-card label is a <span>; should be a heading
// (h3) so screen readers can navigate role-by-role. Mirrors BUG-171.
import { test, expect } from '../../fixtures';

test.describe('Team role-card heading', () => {
  test('role label is a heading', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/team/local**', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        rows: [{ id: 'm1', userId: 'u1', displayName: 'Sam', email: 's@x.com', role: 'Volunteer' }],
        total: 1,
      }),
    }));
    await page.goto('/team');
    await expect(page.getByTestId('team-role-grid')).toBeVisible({ timeout: 10000 });

    const label = page.locator('.team-role-card__label').first();
    await expect(label).toBeVisible();
    const tag = await label.evaluate(el => el.tagName.toLowerCase());
    expect(['h2', 'h3']).toContain(tag);
  });
});
