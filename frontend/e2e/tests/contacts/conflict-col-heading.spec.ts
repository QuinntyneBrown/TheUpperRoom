// BUG-249: conflict-dialog column headings should be h3.
import { test, expect } from '../../fixtures';

test.describe('Conflict column headings', () => {
  test('column headings are h3 elements', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/contacts/c1', (r) => {
      if (r.request().method() === 'PUT') {
        return r.fulfill({
          status: 409, contentType: 'application/json',
          body: JSON.stringify({
            currentVersion: 2,
            current: { id: 'c1', firstName: 'Server', lastName: 'X', email: '', phone: '', city: '', version: 2 },
          }),
        });
      }
      return r.fulfill({
        status: 200, contentType: 'application/json',
        body: JSON.stringify({
          id: 'c1', firstName: 'Sam', lastName: 'Reyes',
          email: 'sam@example.com', phone: '', city: 'Toronto', notes: [], version: 1,
        }),
      });
    });
    await page.goto('/contacts/c1/edit');
    await page.getByLabel('First name').fill('Updated');
    await page.getByTestId('contact-form-submit-btn').click();
    const heading = page.locator('.conflict-col__heading').first();
    await expect(heading).toBeVisible({ timeout: 10000 });
    const tag = await heading.evaluate(el => el.tagName.toLowerCase());
    expect(tag).toBe('h3');
  });
});
