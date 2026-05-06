// BUG-093: design frame FZmxK shows the delete-contact dialog with a
// 56×56 trash icon circle that has a 1px danger stroke. Current
// ur-dialog renders the danger circle with a soft fill but no stroke,
// and delete-contact-dialog doesn't even pass an icon to render.
import { test, expect } from '../../fixtures';

test.describe('Delete contact dialog icon stroke', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead', 'Admin'] }),
    }));
    await page.route('**/api/contacts/c1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'c1', teamId: 't1', firstName: 'Sam', lastName: 'Reyes', version: 1, notes: [],
      }),
    }));
    await page.goto('/contacts/c1');
    await expect(page.getByTestId('contact-more-btn')).toBeVisible({ timeout: 10000 });
    await page.getByTestId('contact-more-btn').click();
    await page.getByTestId('contact-delete-menu-item').click();
    await expect(page.getByTestId('contact-delete-dialog')).toBeVisible();
  });

  test('danger icon circle is rendered with a visible 1px danger border', async ({ page }) => {
    const iconWrap = page.locator('.ur-dialog--danger .ur-dialog__icon');
    await expect(iconWrap).toBeVisible();

    const styles = await iconWrap.evaluate((el) => {
      const cs = getComputedStyle(el);
      return {
        borderTopWidth: cs.borderTopWidth,
        borderTopStyle: cs.borderTopStyle,
        borderTopColor: cs.borderTopColor,
      };
    });
    // expect at least 1px solid border (not "none"/0px)
    expect(styles.borderTopStyle).not.toBe('none');
    expect(parseFloat(styles.borderTopWidth)).toBeGreaterThanOrEqual(1);
    // border color should not be transparent
    expect(styles.borderTopColor).not.toBe('rgba(0, 0, 0, 0)');
  });
});
