// BUG-120: team-members-empty state shows the person_add icon bare.
// Mirrors BUG-118/119 — wrap in a circular accent container so the
// empty state matches peer empty-state visuals.
import { test, expect } from '../../fixtures';

test.describe('Team-empty icon wrap', () => {
  test('icon is wrapped in a circular accent container', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/team/local**', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ rows: [], total: 0 }),
    }));
    await page.goto('/team');
    await expect(page.getByTestId('team-members-empty')).toBeVisible({ timeout: 10000 });

    const wrap = page.getByTestId('team-empty-icon-wrap');
    await expect(wrap).toBeVisible();

    const box = await wrap.boundingBox();
    expect(box).not.toBeNull();
    expect(Math.abs(box!.width - box!.height)).toBeLessThan(2);

    const radius = await wrap.evaluate(el => getComputedStyle(el).borderRadius);
    expect(radius).toMatch(/9999px|50%/);
  });
});
