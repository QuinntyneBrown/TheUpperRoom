// Traces to: 14 — List & Paginate Contacts
// L2-015: contacts list shows 25/page, sortable columns, mobile card view
import { test, expect } from '../../fixtures';

test.describe('List Contacts', () => {
  test('contacts list page loads', async ({ page }) => {
    await page.goto('/contacts');
    await expect(page.locator('body')).toBeVisible();
  });

  test.fixme('shows 25 contacts per page by default', async ({ page, contacts }) => {
    // Requires authenticated session with seeded contacts
  });

  test.fixme('clicking sort header toggles asc/desc', async ({ page, contacts }) => {
    // Requires authenticated session with seeded contacts
  });

  test.fixme('mobile view renders card list under 576px', async ({ page, contacts }) => {
    // Requires viewport resize and authenticated session
  });
});
