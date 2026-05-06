// BUG-129: notes-panel section already has an h2 title; the empty
// state should be a paragraph, not another h2.
import { test, expect } from '../../fixtures';

test.describe('Notes empty heading level', () => {
  test('notes-empty-title is not an <h2>', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/contacts/c1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'c1', teamId: 't1', firstName: 'Sam', lastName: 'Reyes', version: 1, notes: [],
      }),
    }));
    await page.goto('/contacts/c1');
    const empty = page.getByTestId('notes-empty-title');
    await expect(empty).toBeVisible({ timeout: 10000 });
    const tag = await empty.evaluate(el => el.tagName.toLowerCase());
    expect(tag).not.toBe('h2');
  });
});
