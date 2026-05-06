// BUG-198: partner-contacts contact rows should be a <ul><li>.
import { test, expect } from '../../fixtures';

test.describe('Partner-contacts list semantics', () => {
  test('contacts render in a <ul aria-label> with <li> rows', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/partners/p1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'p1', name: 'Mountain Top Church', city: 'Toronto', stage: 'Lead',
        contacts: [
          { id: 'c1', firstName: 'Sam', lastName: 'Reyes', email: 'sam@example.com' },
          { id: 'c2', firstName: 'Pat', lastName: 'O', email: 'pat@example.com' },
        ],
        notes: [], history: [], version: 1,
      }),
    }));
    await page.goto('/partners/p1');
    const ul = page.locator('ul.partner-contacts__list');
    await expect(ul).toBeVisible({ timeout: 10000 });
    await expect(ul).toHaveAttribute('aria-label', /linked contacts/i);
    expect(await ul.locator('li.partner-contacts__row').count()).toBe(2);
  });
});
