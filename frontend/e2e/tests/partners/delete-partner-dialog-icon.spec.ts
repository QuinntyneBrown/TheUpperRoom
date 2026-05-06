// BUG-094: design frame Vf7RJ shows the partner-delete dialog with a
// trash icon in a danger-bordered circle. Implementation doesn't pass
// an icon to ur-dialog, so the danger circle never renders.
import { test, expect } from '../../fixtures';

test.describe('Delete partner dialog icon', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead', 'Admin'] }),
    }));
    await page.route('**/api/partners/p1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'p1', name: 'Mountain Top Church', city: 'Toronto', stage: 'Lead',
        contacts: [], notes: [], history: [], version: 1,
      }),
    }));
    await page.goto('/partners/p1');
    await expect(page.getByTestId('partner-more-btn')).toBeVisible({ timeout: 10000 });
    await page.getByTestId('partner-more-btn').click();
    await page.getByTestId('partner-delete-menu-item').click();
    await expect(page.getByTestId('partner-delete-dialog')).toBeVisible();
  });

  test('renders the danger icon circle with the trash icon', async ({ page }) => {
    const iconWrap = page.locator('.ur-dialog--danger .ur-dialog__icon');
    await expect(iconWrap).toBeVisible();
    await expect(iconWrap.locator('mat-icon')).toBeVisible();

    const styles = await iconWrap.evaluate((el) => {
      const cs = getComputedStyle(el);
      return {
        borderTopWidth: cs.borderTopWidth,
        borderTopStyle: cs.borderTopStyle,
      };
    });
    expect(styles.borderTopStyle).not.toBe('none');
    expect(parseFloat(styles.borderTopWidth)).toBeGreaterThanOrEqual(1);
  });
});
