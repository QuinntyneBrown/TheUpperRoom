// BUG-166: bottom-nav lacks aria-label. With multiple navigation
// landmarks present, each should be distinguishable.
import { test, expect } from '../../fixtures';

test.describe('Bottom nav aria-label', () => {
  test('bottom-nav has an aria-label', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'mobile viewport sufficient on chromium');
    await page.setViewportSize({ width: 360, height: 740 });
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.goto('/dashboard');
    const nav = page.getByTestId('bottom-nav');
    await expect(nav).toBeVisible({ timeout: 10000 });
    const label = await nav.getAttribute('aria-label');
    expect(label).toBeTruthy();
  });
});
