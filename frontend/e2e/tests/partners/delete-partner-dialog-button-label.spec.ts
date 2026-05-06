// BUG-045: same pattern as BUG-029 — the delete-partner-dialog
// confirm button should include the partner name. Reuses the
// DeletePartnerDialogData already piped through for the title fix
// (BUG-021).
import { test, expect } from '../../fixtures';

test.describe('Delete partner dialog button label', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead', 'Admin'] }),
    }));
    await page.route('**/api/partners/p1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'p1', name: 'Mountain Top Church', city: 'Toronto', stage: 'Confirmed',
        history: [], contacts: [], notes: [],
      }),
    }));
    await page.goto('/partners/p1');
    await expect(page.getByTestId('partner-more-btn')).toBeVisible({ timeout: 10000 });
    await page.getByTestId('partner-more-btn').click();
    await page.getByTestId('partner-delete-menu-item').click();
    await expect(page.getByTestId('partner-delete-dialog')).toBeVisible();
  });

  test('confirm button reads "Delete Mountain Top Church"', async ({ page }) => {
    await expect(page.getByTestId('confirm-delete-partner-btn')).toContainText('Delete Mountain Top Church');
  });
});
