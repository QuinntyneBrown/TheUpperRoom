// BUG-149: products section empty has a bare mat-icon. Mirror the
// circular wrap used by other empty states.
import { test, expect } from '../../fixtures';

test.describe('Products empty icon wrap', () => {
  test('icon is wrapped in a circular bordered container', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/hackathons/h1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'h1', title: 'Spring 2026', hostCity: 'Toronto',
        startDate: '2026-05-18', endDate: '2026-05-21',
        currentStage: 'Develop', partners: [], history: [], products: [],
      }),
    }));
    await page.goto('/hackathons/h1');
    await expect(page.getByTestId('products-section-empty')).toBeVisible({ timeout: 10000 });

    const wrap = page.getByTestId('products-empty-icon-wrap');
    await expect(wrap).toBeVisible();

    const box = await wrap.boundingBox();
    expect(box).not.toBeNull();
    expect(Math.abs(box!.width - box!.height)).toBeLessThan(2);

    const radius = await wrap.evaluate(el => getComputedStyle(el).borderRadius);
    expect(radius).toMatch(/9999px|50%/);
  });
});
