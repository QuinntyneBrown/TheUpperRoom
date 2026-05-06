// BUG-095: design frame s5uPzc shows "New contact" with the subtitle
// "Add someone to your city's contact directory." Implementation
// only renders the title.
import { test, expect } from '../../fixtures';

test.describe('New-contact dialog subtitle', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/contacts**', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ rows: [], total: 0, page: 1, pageSize: 20 }),
    }));
    await page.goto('/contacts');
    await expect(page.getByTestId('new-contact-btn')).toBeVisible({ timeout: 10000 });
    await page.getByTestId('new-contact-btn').click();
  });

  test('renders the directory subtitle', async ({ page }) => {
    const subtitle = page.getByTestId('new-contact-subtitle');
    await expect(subtitle).toBeVisible();
    await expect(subtitle).toContainText("Add someone to your city's contact directory");
  });
});
