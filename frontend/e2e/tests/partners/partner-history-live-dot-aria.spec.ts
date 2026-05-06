// BUG-172: partner-history live-dot is decorative (just a colored
// circle) but lacks aria-hidden, leaving it in the accessibility tree.
import { test, expect } from '../../fixtures';

test.describe('Partner-history live dot aria-hidden', () => {
  test('live-dot span has aria-hidden="true"', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/partners/p1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'p1', name: 'Mountain Top', city: 'Toronto', stage: 'Lead',
        contacts: [], notes: [], history: [], version: 1,
      }),
    }));
    await page.goto('/partners/p1');
    const dot = page.locator('.partner-history__live-dot');
    await expect(dot).toBeVisible({ timeout: 10000 });
    await expect(dot).toHaveAttribute('aria-hidden', 'true');
  });
});
