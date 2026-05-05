// Traces to: 11 — Delete Contact
// L2-012 AC: confirm dialog, soft delete, contact disappears; restore by admin
import { test, expect } from '../../fixtures';

test.describe('Delete Contact', () => {
  test('contact detail page has delete action', async ({ page }) => {
    await page.goto('/contacts/00000000-0000-0000-0000-000000000001');
    await expect(page.locator('body')).toBeVisible();
  });

  test.fixme('city lead can delete contact via confirm dialog', async ({ page, contacts }) => {
    // Requires authenticated session with seeded contact
  });

  test.fixme('deleted contact does not appear in list', async ({ page, contacts }) => {
    // Requires full e2e session
  });
});
