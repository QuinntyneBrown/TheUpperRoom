// BUG-294: conflict-col should be sections with aria-labelledby.
import { test, expect } from '../../fixtures';

test.describe('Conflict col sections', () => {
  test('conflict-col is a section with aria-labelledby', async ({ page }) => {
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
    const yours = page.getByTestId('conflict-your-changes');
    await expect(yours).toBeVisible({ timeout: 10000 });
    const tag = await yours.evaluate(el => el.tagName.toLowerCase());
    expect(tag).toBe('section');
    await expect(yours).toHaveAttribute('aria-labelledby', 'conflict-your-heading');
  });
});
