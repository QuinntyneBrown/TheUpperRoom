// BUG-021: design frame Vf7RJ shows the partner-delete dialog title
// as "Delete <Partner Name>?". Implementation shows static "Delete partner".
import { test, expect } from '../../fixtures';

test.describe('Delete partner dialog title', () => {
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

  test('title includes the partner name', async ({ page }) => {
    const dialog = page.getByTestId('partner-delete-dialog');
    await expect(dialog).toContainText('Mountain Top Church');
  });
});
