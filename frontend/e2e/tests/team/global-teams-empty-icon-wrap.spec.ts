// BUG-135: global-teams empty state has a bare mat-icon. Mirror the
// circular bordered wrap used elsewhere.
import { test, expect } from '../../fixtures';

test.describe('Global teams empty icon wrap', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['Admin'] }),
    }));
    await page.route('**/api/teams**', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ rows: [], total: 0 }),
    }));
    await page.goto('/teams');
    await expect(page.getByTestId('teams-empty')).toBeVisible({ timeout: 10000 });
  });

  test('icon is wrapped in a circular bordered container', async ({ page }) => {
    const wrap = page.getByTestId('teams-empty-icon-wrap');
    await expect(wrap).toBeVisible();

    const box = await wrap.boundingBox();
    expect(box).not.toBeNull();
    expect(Math.abs(box!.width - box!.height)).toBeLessThan(2);

    const radius = await wrap.evaluate(el => getComputedStyle(el).borderRadius);
    expect(radius).toMatch(/9999px|50%/);
  });
});
