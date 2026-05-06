// BUG-034: design frame x6ykzA shows "Couldn't load notifications" as
// a heading (Geist 18/600). Current implementation uses a <p> element.
// Promote to <h2> for correct semantics (mirrors BUG-030/033).
import { test, expect } from '../../fixtures';

test.describe('Notifications error title element', () => {
  test('"Couldn\'t load notifications" is rendered as an h2', async ({ page, auth }) => {
    await auth.signInAs('city-lead');

    await page.route('**/api/notifications*', (route) => {
      route.fulfill({ status: 502, body: 'Bad Gateway' });
    });

    await page.reload();
    await page.getByTestId('notification-bell').click();
    await expect(page.getByTestId('notifications-error')).toBeVisible({ timeout: 5000 });

    const title = page.getByTestId('notifications-error-title');
    await expect(title).toHaveJSProperty('tagName', 'H2');
    await expect(title).toHaveText("Couldn't load notifications");
  });
});
