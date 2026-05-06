// BUG-015: design frame g9pKsq shows the "+ Add note" header button
// as filled brand-purple primary. Implementation uses mat-stroked-button.
import { test, expect } from '../../fixtures';

test.describe('Partner-detail add-note button', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/partners/p1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'p1', name: 'FaithTech Toronto', city: 'Toronto', stage: 'Confirmed',
        history: [], contacts: [], notes: [],
      }),
    }));
    await page.goto('/partners/p1');
    await expect(page.getByTestId('partner-add-note-btn')).toBeVisible({ timeout: 10000 });
  });

  test('add-note button is rendered as ur-button', async ({ page }) => {
    await expect(page.getByTestId('partner-add-note-btn')).toHaveJSProperty('tagName', 'UR-BUTTON');
  });
});
