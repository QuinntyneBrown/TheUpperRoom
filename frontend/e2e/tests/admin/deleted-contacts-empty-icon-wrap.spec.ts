// BUG-156: deleted-contacts empty state shows the archive icon bare.
// Mirrors empty-icon-wrap pattern from BUG-118/119/120/123/127.
import { test, expect } from '../../fixtures';

test.describe('Deleted-contacts empty icon wrap', () => {
  test('icon is wrapped in a circular accent container', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['Admin'] }),
    }));
    await page.route('**/api/contacts/deleted**', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: '[]',
    }));
    await page.goto('/admin/deleted-contacts');
    await expect(page.getByTestId('deleted-contacts-empty')).toBeVisible({ timeout: 10000 });

    const wrap = page.getByTestId('deleted-contacts-empty-icon-wrap');
    await expect(wrap).toBeVisible();

    const box = await wrap.boundingBox();
    expect(box).not.toBeNull();
    expect(Math.abs(box!.width - box!.height)).toBeLessThan(2);

    const radius = await wrap.evaluate(el => getComputedStyle(el).borderRadius);
    expect(radius).toMatch(/9999px|50%/);
  });
});
