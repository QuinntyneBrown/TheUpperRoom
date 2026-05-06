// BUG-039: the notes-panel empty-state title is a <p>; design uses a
// heading. Promote to <h2> for correct semantics (mirrors
// BUG-035/036/037/038).
import { test, expect } from '../../fixtures';

const CONTACT = {
  id: 'c1',
  firstName: 'Sam',
  lastName: 'Reyes',
  email: 'sam@example.com',
  phone: null,
  city: 'Toronto',
  notes: [],
};

test.describe('Notes-panel empty-state title element', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: 'u1', displayName: 'Quinn', email: 'q@example.com', roles: ['CityLead'] }),
    }));
    await page.route('**/api/contacts/c1', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: JSON.stringify(CONTACT),
    }));
    await page.goto('/contacts/c1');
    await expect(page.getByTestId('notes-empty')).toBeVisible({ timeout: 10000 });
  });

  test('"No notes yet." is rendered as an h2', async ({ page }) => {
    const title = page.getByTestId('notes-empty-title');
    await expect(title).toHaveJSProperty('tagName', 'H2');
    await expect(title).toHaveText('No notes yet.');
  });
});
