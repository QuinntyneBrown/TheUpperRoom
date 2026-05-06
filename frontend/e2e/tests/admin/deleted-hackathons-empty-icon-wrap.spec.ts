// BUG-136: deleted-hackathons admin empty state has a bare mat-icon.
// Mirror the bordered-circle wrap used elsewhere.
import { test, expect } from '../../fixtures';

test.describe('Deleted hackathons empty icon wrap', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['Admin'] }),
    }));
    await page.route('**/api/admin/deleted-hackathons', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: '[]',
    }));
    await page.goto('/admin/deleted-hackathons');
    await expect(page.getByTestId('deleted-hackathons-empty')).toBeVisible({ timeout: 10000 });
  });

  test('icon is wrapped in a circular bordered container', async ({ page }) => {
    const wrap = page.getByTestId('deleted-hackathons-empty-icon-wrap');
    await expect(wrap).toBeVisible();

    const box = await wrap.boundingBox();
    expect(box).not.toBeNull();
    expect(Math.abs(box!.width - box!.height)).toBeLessThan(2);

    const radius = await wrap.evaluate(el => getComputedStyle(el).borderRadius);
    expect(radius).toMatch(/9999px|50%/);
  });
});
