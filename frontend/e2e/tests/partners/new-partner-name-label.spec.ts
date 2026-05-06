// BUG-096: design frame SmzaX labels the first new-partner field
// "Partner name *". Implementation labels it "Organization name *".
import { test, expect } from '../../fixtures';

test.describe('New-partner first field label', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/partners', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: '[]',
    }));
    await page.goto('/partners');
    await expect(page.getByTestId('new-partner-btn')).toBeVisible({ timeout: 10000 });
    await page.getByTestId('new-partner-btn').click();
    await expect(page.getByTestId('partner-create-form')).toBeVisible();
  });

  test('first field label is "Partner name"', async ({ page }) => {
    const form = page.getByTestId('partner-create-form');
    await expect(form).toContainText(/Partner name\s*\*/);
    await expect(form).not.toContainText(/Organization name/);
  });
});
