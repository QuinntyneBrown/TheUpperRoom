// BUG-119: notifications-empty state shows the notifications_none icon
// bare. Mirrors BUG-118 — wrap in a circular accent container so the
// empty state matches peer empty-state visuals.
import { test, expect } from '../../fixtures';

test.describe('Notifications-empty icon wrap', () => {
  test('icon is wrapped in a circular accent container', async ({ page, auth }) => {
    await auth.signInAs('city-lead');
    await page.route('**/api/notifications*', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ rows: [], unreadCount: 0 }),
    }));
    await page.reload();

    const bell = page.getByTestId('notification-bell');
    await expect(bell).toBeVisible({ timeout: 5000 });
    await bell.click();

    const wrap = page.getByTestId('notifications-empty-icon-wrap');
    await expect(wrap).toBeVisible();

    const box = await wrap.boundingBox();
    expect(box).not.toBeNull();
    expect(Math.abs(box!.width - box!.height)).toBeLessThan(2);

    const radius = await wrap.evaluate(el => getComputedStyle(el).borderRadius);
    expect(radius).toMatch(/9999px|50%/);
  });
});
