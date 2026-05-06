// BUG-160: search overlay is role="dialog" aria-modal="true" but
// has no focus trap. Verify cdkTrapFocus directive is applied.
import { test, expect } from '../../fixtures';

test.describe('Global search overlay focus trap', () => {
  test('panel has cdkTrapFocus attribute', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.goto('/dashboard');
    await expect(page.getByTestId('global-search-trigger')).toBeVisible({ timeout: 10000 });
    await page.getByTestId('global-search-trigger').click();
    const overlay = page.getByTestId('search-overlay');
    await expect(overlay).toBeVisible();
    // cdkTrapFocus directive renders attribute selector cdkTrapFocus
    const hasTrap = await overlay.evaluate(el => el.hasAttribute('cdkTrapFocus'));
    expect(hasTrap).toBe(true);
  });
});
