// BUG-102: delete-hackathon-dialog doesn't pass icon to ur-dialog so
// the danger circle never renders. Mirrors BUG-100/094 (delete-contact
// and delete-partner dialogs).
import { test, expect } from '../../fixtures';

test.describe('Delete hackathon dialog icon', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead', 'Admin'] }),
    }));
    await page.route('**/api/hackathons/h1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'h1', title: 'Spring Hack', startsOn: '2026-05-01', endsOn: '2026-05-03',
        hostCity: 'Toronto', version: 1,
      }),
    }));
    await page.goto('/hackathons/h1');
    await expect(page.getByTestId('hackathon-more-btn')).toBeVisible({ timeout: 10000 });
    await page.getByTestId('hackathon-more-btn').click();
    await page.getByTestId('hackathon-delete-menu-item').click();
    await expect(page.getByTestId('hackathon-delete-dialog')).toBeVisible();
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
