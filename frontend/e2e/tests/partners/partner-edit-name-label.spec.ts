// BUG-108: design frame jS1hx (Partner Edit Pristine) labels the
// first field "Partner name *". Implementation labels it
// "Organization name *". Mirrors BUG-096 for the create dialog.
import { test, expect } from '../../fixtures';

test.describe('Partner-edit first field label', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/partners/p1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'p1', name: 'Mountain Top Church', city: 'Toronto', stage: 'Lead',
        contacts: [], notes: [], history: [], version: 1,
      }),
    }));
    await page.goto('/partners/p1/edit');
    await expect(page.getByTestId('partner-edit-heading')).toBeVisible({ timeout: 10000 });
  });

  test('first field label is "Partner name"', async ({ page }) => {
    const card = page.getByTestId('partner-edit');
    await expect(card).toContainText(/Partner name\s*\*/);
    await expect(card).not.toContainText(/Organization name/);
  });
});
