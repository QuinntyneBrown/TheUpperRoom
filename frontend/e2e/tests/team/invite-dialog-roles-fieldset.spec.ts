// BUG-156: Roles checkbox group is labelled by a span. Use a
// fieldset/legend so screen readers announce the group label for
// each checkbox.
import { test, expect } from '../../fixtures';

test.describe('Invite dialog roles fieldset', () => {
  test('Roles checkboxes are inside a fieldset with a legend', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/team/members', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: '[]',
    }));
    await page.goto('/team');
    await expect(page.getByTestId('invite-member-button')).toBeVisible({ timeout: 10000 });
    await page.getByTestId('invite-member-button').click();
    await expect(page.getByTestId('invite-dialog')).toBeVisible();

    const dialog = page.getByTestId('invite-dialog');
    const fieldset = dialog.locator('fieldset', { hasText: /Roles/i });
    await expect(fieldset).toBeVisible();
    const legend = fieldset.locator('legend');
    await expect(legend).toContainText(/Roles/i);
  });
});
