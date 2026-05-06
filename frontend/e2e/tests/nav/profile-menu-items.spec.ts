// BUG-008: design frame U7ry4 shows the desktop profile menu containing
// a "Workspace settings" entry that links to /settings. The current
// implementation only renders the Sign out item.
import { test, expect } from '../../fixtures';
import { AuthPages } from '../../pages/auth-pages';

test.describe('Profile menu — Workspace settings entry', () => {
  test('clicking the menu shows a Workspace settings item linking to /settings', async ({ page }) => {
    const auth = new AuthPages(page);
    await auth.signInAs('city-lead');

    await page.getByTestId('profile-menu-trigger').click();
    const settingsItem = page.getByTestId('profile-menu-settings');
    await expect(settingsItem).toBeVisible();
    await expect(settingsItem).toContainText('Workspace settings');

    await settingsItem.click();
    await page.waitForURL(/\/settings/);
  });
});
