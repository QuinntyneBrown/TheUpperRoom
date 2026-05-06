// Traces to: T179 — topbar bell opens sidenav instead of notifications panel
import { test, expect } from '../../fixtures';

test.describe('Topbar bell opens notifications', () => {
  test('clicking bell on tablet opens notification panel, not sidenav', async ({ page, auth }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await auth.signInAs('city-lead');

    // Sidenav should be closed initially on tablet
    await expect(page.getByTestId('side-nav')).toHaveAttribute('aria-hidden', 'true', { timeout: 3000 });

    // The topbar bell — not the side-nav bell
    const topbarBell = page.locator('mat-toolbar button[aria-label="Notifications"]');
    await expect(topbarBell).toBeVisible();
    await topbarBell.click();

    // Notification panel should be visible
    await expect(page.getByTestId('notification-panel')).toBeVisible({ timeout: 2000 });

    // Sidenav should still be closed
    await expect(page.getByTestId('side-nav')).toHaveAttribute('aria-hidden', 'true');
  });
});
