// BUG-233: conflict-dialog field rows should use dl/dt/dd.
import { test, expect } from '../../fixtures';

test.describe('Conflict dialog dl/dt/dd semantics', () => {
  test('conflict columns render as definition lists', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    let putCalled = 0;
    await page.route('**/api/contacts/c1', (r) => {
      if (r.request().method() === 'PUT') {
        putCalled++;
        return r.fulfill({
          status: 409, contentType: 'application/json',
          body: JSON.stringify({
            currentVersion: 2,
            current: { id: 'c1', firstName: 'Server', lastName: 'Name', email: 's@e.com', phone: '', city: 'X', version: 2 },
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
    const dl = page.locator('dl.conflict-fields').first();
    await expect(dl).toBeVisible({ timeout: 10000 });
    expect(await dl.locator('dt').count()).toBeGreaterThan(0);
    expect(await dl.locator('dd').count()).toBeGreaterThan(0);
  });
});
