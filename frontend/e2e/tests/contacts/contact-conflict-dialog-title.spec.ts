// BUG-135: conflict-dialog h2 "Save conflict" has no testid while
// sibling content uses testids extensively. Mirrors heading-testid
// pattern.
import { test, expect } from '../../fixtures';

test.describe('Contact conflict-dialog title testid', () => {
  test('"Save conflict" h2 has testid conflict-dialog-title', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    let saveCount = 0;
    await page.route('**/api/contacts/c1', (r) => {
      const method = r.request().method();
      if (method === 'PUT' || method === 'PATCH') {
        saveCount++;
        return r.fulfill({
          status: 409, contentType: 'application/json',
          body: JSON.stringify({
            id: 'c1', teamId: 't1', firstName: 'Sam', lastName: 'Reyes',
            email: 'sam@example.com', city: 'Vancouver', version: 2, notes: [],
          }),
        });
      }
      return r.fulfill({
        status: 200, contentType: 'application/json',
        body: JSON.stringify({
          id: 'c1', teamId: 't1', firstName: 'Sam', lastName: 'Reyes',
          email: '', phone: '', city: 'Toronto', version: 1, notes: [],
        }),
      });
    });
    await page.goto('/contacts/c1/edit');
    await expect(page.getByTestId('contact-edit-title')).toBeVisible({ timeout: 10000 });

    // Trigger save -> 409 -> conflict dialog opens.
    await page.locator('button[type="submit"]').first().click();
    await expect(page.getByTestId('conflict-dialog')).toBeVisible({ timeout: 5000 });

    const title = page.getByTestId('conflict-dialog-title');
    await expect(title).toHaveJSProperty('tagName', 'H2');
    await expect(title).toHaveText('Save conflict');
    expect(saveCount).toBeGreaterThanOrEqual(1);
  });
});
