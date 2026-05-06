// BUG-021: design frame s5uPzc shows the new-contact dialog submit
// button as "Create contact"; the current implementation reads
// "Save contact".
import { test, expect } from '../../fixtures';

test.describe('New contact dialog submit label', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/contacts*', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ rows: [], total: 0 }) });
    });
    await page.goto('/contacts');
  });

  test('submit button reads "Create contact"', async ({ page }) => {
    await page.getByTestId('new-contact-btn').click();
    await expect(page.getByTestId('new-contact-dialog-submit')).toContainText('Create contact');
  });
});
