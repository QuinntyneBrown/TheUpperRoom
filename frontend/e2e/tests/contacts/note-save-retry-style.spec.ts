// BUG-070: notes-panel save-error toast Retry uses mat-button.
// Switch to ur-button variant=ghost (mirrors BUG-068/069).
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

test.describe('Notes-panel save Retry button style', () => {
  test('Retry button is rendered as ur-button', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: 'u1', displayName: 'Quinn', email: 'q@example.com', roles: ['CityLead'] }),
    }));
    await page.route('**/api/contacts/c1', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: JSON.stringify(CONTACT),
    }));
    await page.route('**/api/contacts/c1/notes', (r) => r.fulfill({
      status: 502, body: 'Bad Gateway',
    }));

    await page.goto('/contacts/c1');
    await expect(page.getByTestId('add-note-btn')).toBeVisible({ timeout: 10000 });

    await page.locator('textarea[aria-label="New note"]').fill('Test note draft');
    await page.getByTestId('add-note-btn').click();

    await expect(page.getByTestId('note-save-error-toast')).toBeVisible({ timeout: 5000 });
    await expect(page.getByTestId('note-save-retry-btn')).toHaveJSProperty('tagName', 'UR-BUTTON');
  });
});
