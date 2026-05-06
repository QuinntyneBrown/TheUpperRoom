// BUG-098: design frame bFXfn shows the search-off icon inside a
// 64×64 circular wrapper. Implementation renders the bare mat-icon.
import { test, expect } from '../../fixtures';

test.describe('Global search no-results icon wrap', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/search**', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ contacts: [], partners: [], hackathons: [] }),
    }));
    await page.goto('/dashboard');
    await expect(page.getByTestId('global-search-trigger')).toBeVisible({ timeout: 10000 });
    await page.getByTestId('global-search-trigger').click();
    await page.getByTestId('search-input').fill('xyznotfound');
    await expect(page.getByTestId('search-no-results')).toBeVisible({ timeout: 5000 });
  });

  test('search-off icon is wrapped in a circular bordered container', async ({ page }) => {
    const wrap = page.getByTestId('search-no-results-icon-wrap');
    await expect(wrap).toBeVisible();

    const box = await wrap.boundingBox();
    expect(box).not.toBeNull();
    expect(Math.abs(box!.width - box!.height)).toBeLessThan(2);

    const radius = await wrap.evaluate(el => getComputedStyle(el).borderRadius);
    expect(radius).toMatch(/9999px|50%/);
  });
});
