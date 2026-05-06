// BUG-167: sidenav nav-lists aren't labelled by their section
// heading. Add aria-labelledby pointing to the WORKSPACE/GLOBAL <p>.
import { test, expect } from '../../fixtures';

test.describe('Sidenav nav-list aria-labelledby', () => {
  test('workspace nav-list is labelled by the WORKSPACE heading', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.goto('/dashboard');
    const sidenav = page.getByTestId('side-nav');
    await expect(sidenav).toBeVisible({ timeout: 10000 });

    const workspace = sidenav.locator('mat-nav-list').first();
    await expect(workspace).toHaveAttribute('aria-labelledby', /workspace/i);
    const global = sidenav.locator('mat-nav-list').last();
    await expect(global).toHaveAttribute('aria-labelledby', /global/i);
  });
});
