// BUG-089: hamburger button has static aria-label="Open navigation"
// even when the sidenav is open. Bind it to the sidenav's opened
// property so it toggles between "Open navigation" and "Close
// navigation".
import { test, expect } from '../../fixtures';

test.describe('Hamburger aria-label reflects sidenav state', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: 'u1', displayName: 'Quinn', email: 'q@example.com', roles: ['CityLead'] }),
    }));
    // Tablet viewport so the hamburger is visible (not desktop, not mobile).
    await page.setViewportSize({ width: 900, height: 800 });
    await page.goto('/dashboard');
    await expect(page.getByTestId('hamburger')).toBeVisible({ timeout: 10000 });
  });

  test('clicking the hamburger toggles aria-label between Open and Close', async ({ page }) => {
    const hamburger = page.getByTestId('hamburger');

    // On tablet, sidenav is initially closed (mode=over).
    await expect(hamburger).toHaveAttribute('aria-label', 'Open navigation');

    await hamburger.click();
    await expect(hamburger).toHaveAttribute('aria-label', 'Close navigation');
  });
});
