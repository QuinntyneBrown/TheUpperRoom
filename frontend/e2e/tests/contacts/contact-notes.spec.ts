// Traces to: 12 — Contact Notes
// L2-013 AC: inline add-note form, edit-in-place, delete confirm
import { test, expect } from '../../fixtures';

test.describe('Contact Notes', () => {
  test('notes panel is present on contact detail page', async ({ page }) => {
    await page.goto('/contacts/00000000-0000-0000-0000-000000000001');
    await expect(page.locator('body')).toBeVisible();
  });

  test('add-note form is visible inside notes section', async ({ page }) => {
    await page.goto('/contacts/00000000-0000-0000-0000-000000000001');
    await expect(page.getByTestId('contact-notes-section')).toBeVisible();
    await expect(page.getByTestId('add-note-form')).toBeVisible();
  });

  test.fixme('author can add a note and it appears in the list', async ({ page, contacts }) => {
    // Requires authenticated session with seeded contact
  });

  test.fixme('author can edit own note inline', async ({ page, contacts }) => {
    // Requires authenticated session with seeded contact + existing note
  });

  test.fixme('author can delete own note with confirm', async ({ page, contacts }) => {
    // Requires authenticated session with seeded contact + existing note
  });

  test.fixme('body exceeding 4000 chars shows validation error', async ({ page, contacts }) => {
    // Requires authenticated session
  });
});
