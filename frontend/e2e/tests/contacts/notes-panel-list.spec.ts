// BUG-199: notes are rendered as divs; should be <ul><li>.
import { test, expect } from '../../fixtures';

test.describe('Notes panel list semantics', () => {
  test('notes render in a <ul> with <li> rows', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/contacts/c1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'c1', teamId: 't1', firstName: 'Sam', lastName: 'Reyes', version: 1,
        notes: [
          { id: 'n1', body: 'First note', createdAt: '2026-04-01T12:00:00Z', authorId: '2' },
          { id: 'n2', body: 'Second note', createdAt: '2026-04-02T12:00:00Z', authorId: '2' },
        ],
      }),
    }));
    await page.goto('/contacts/c1');
    const ul = page.locator('ul.notes-panel__list');
    await expect(ul).toBeVisible({ timeout: 10000 });
    await expect(ul).toHaveAttribute('aria-label', /notes/i);
    expect(await ul.locator('li.note-card').count()).toBe(2);
  });
});
