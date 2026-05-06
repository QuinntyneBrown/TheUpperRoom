// BUG-123: hackathons-empty state shows the rocket_launch icon bare.
// Mirrors BUG-118/119/120 — wrap in a circular accent container.
import { test, expect } from '../../fixtures';

test.describe('Hackathons-empty icon wrap', () => {
  test('icon is wrapped in a circular accent container', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/hackathons**', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: '[]',
    }));
    await page.goto('/hackathons');
    await expect(page.getByTestId('hackathons-empty')).toBeVisible({ timeout: 10000 });

    const wrap = page.getByTestId('hackathons-empty-icon-wrap');
    await expect(wrap).toBeVisible();

    const box = await wrap.boundingBox();
    expect(box).not.toBeNull();
    expect(Math.abs(box!.width - box!.height)).toBeLessThan(2);

    const radius = await wrap.evaluate(el => getComputedStyle(el).borderRadius);
    expect(radius).toMatch(/9999px|50%/);
  });
});
