// T97 — contacts list primary CTA should read "+ New contact"
import { test, expect } from '../../fixtures';

test.describe('Contacts list new button text', () => {
  test('new contact button shows "+ New contact"', async ({ page }) => {
    await page.route('**/api/contacts*', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ rows: [], total: 0 }) });
    });
    await page.goto('/contacts');
    await expect(page.getByTestId('new-contact-btn')).toContainText('+ New contact');
  });
});
