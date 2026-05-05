// T114 — contacts list header layout: subtitle + search in header row
import { test, expect } from '../../fixtures';

const CONTACTS_MOCK = {
  rows: [
    { id: 'c1', firstName: 'Alice', lastName: 'Brown', email: 'alice@example.com', city: 'Toronto' },
  ],
  total: 42,
};

test.describe('Contacts list header layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/contacts*', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(CONTACTS_MOCK) });
    });
    await page.goto('/contacts');
  });

  test('shows contact count subtitle below heading', async ({ page }) => {
    await expect(page.getByTestId('contacts-count-subtitle')).toContainText('42 contacts');
  });

  test('search input and new contact button are in the same header row as heading', async ({ page }) => {
    const header = page.locator('.contacts-list-page__header');
    await expect(header.getByTestId('contact-search-input')).toBeVisible();
    await expect(header.getByTestId('new-contact-btn')).toBeVisible();
  });
});
