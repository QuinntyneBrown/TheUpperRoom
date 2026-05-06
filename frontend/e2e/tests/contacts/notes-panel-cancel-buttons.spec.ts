// BUG-017: Cancel buttons in note edit + delete-confirm states should
// use ur-button to match the brand button system used everywhere else
// (the primary Save/Delete actions in the same row are already
// ur-button).
import { test, expect } from '../../fixtures';

const authStub = { id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] };
const contactStub = {
  id: 'c1', teamId: 't1', firstName: 'Sam', lastName: 'Reyes', version: 1,
  notes: [
    { id: 'n1', body: 'first note', createdAt: '2026-05-01T00:00:00Z', authorId: '1', authorName: 'Quinn' },
  ],
};

test.describe('Notes-panel cancel buttons use ur-button', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify(authStub),
    }));
    await page.route('**/api/contacts/c1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify(contactStub),
    }));
    await page.goto('/contacts/c1');
    await expect(page.getByTestId('note-n1')).toBeVisible({ timeout: 10000 });
  });

  test('edit-state cancel is a ur-button', async ({ page }) => {
    await page.getByTestId('note-edit-btn').click();
    await expect(page.getByTestId('note-cancel-edit-btn')).toHaveJSProperty('tagName', 'UR-BUTTON');
  });

  test('delete-confirm cancel is a ur-button', async ({ page }) => {
    await page.getByTestId('note-delete-btn').click();
    await expect(page.getByTestId('note-cancel-delete-btn')).toHaveJSProperty('tagName', 'UR-BUTTON');
  });
});
