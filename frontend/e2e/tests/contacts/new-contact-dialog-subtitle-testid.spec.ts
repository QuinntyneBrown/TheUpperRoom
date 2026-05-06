// BUG-155: new-contact-dialog passes subtitleTestId="new-contact-
// subtitle" to ur-dialog but the input doesn't exist. Either implement
// it or drop the dead attribute. Test asserts the subtitle is
// findable by that testid.
import { test, expect } from '../../fixtures';

test.describe('New-contact dialog subtitle testid', () => {
  test('subtitle is findable by data-testid="new-contact-subtitle"', async ({ page }) => {
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
    await expect(page.getByTestId('new-contact-dialog')).toBeVisible();

    const subtitle = page.getByTestId('new-contact-subtitle');
    await expect(subtitle).toBeVisible();
    await expect(subtitle).toContainText("Add someone to your city's contact directory");
  });
});
