// BUG-016: design frame jS1hx shows the partner-edit card with an
// "Edit partner" heading at the top. Implementation goes straight to
// the form fields with no heading inside the card.
import { test, expect } from '../../fixtures';

test.describe('Partner-edit card heading', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/partners/p1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'p1', name: 'Mountain Top Church', city: 'Toronto', stage: 'Confirmed',
        history: [], contacts: [], notes: [],
      }),
    }));
    await page.goto('/partners/p1/edit');
    await expect(page.getByTestId('partner-edit-save-btn')).toBeVisible({ timeout: 10000 });
  });

  test('card has "Edit partner" heading', async ({ page }) => {
    const heading = page.getByTestId('partner-edit-heading');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('Edit partner');
  });
});
