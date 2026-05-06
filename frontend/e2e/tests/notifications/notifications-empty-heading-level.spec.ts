// BUG-150: notifications panel already has an <h2> "Notifications";
// the empty-state title is another <h2> at the same level. Convert
// to <p>. Mirrors BUG-127/146/148/149.
import { test, expect } from '../../fixtures';

test.describe('Notifications-empty heading level', () => {
  test('empty title is not an <h2>', async ({ page, auth }) => {
    await auth.signInAs('city-lead');
    await page.route('**/api/notifications*', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ rows: [], unreadCount: 0 }),
    }));
    await page.reload();

    const bell = page.getByTestId('notification-bell');
    await expect(bell).toBeVisible({ timeout: 5000 });
    await bell.click();

    const empty = page.getByTestId('notifications-empty-title');
    await expect(empty).toBeVisible({ timeout: 5000 });
    const tag = await empty.evaluate(el => el.tagName.toLowerCase());
    expect(tag).not.toBe('h2');
  });
});
