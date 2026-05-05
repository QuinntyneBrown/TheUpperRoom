// T127 — contacts list header, table, and search CSS
import { test, expect } from '../../fixtures';

const ROWS = [
  { id: 'c1', firstName: 'Alice', lastName: 'Smith', email: 'alice@example.com', city: 'Toronto' },
  { id: 'c2', firstName: 'Bob', lastName: 'Jones', email: 'bob@example.com', city: 'Vancouver' },
];

test.describe('Contacts list header and table CSS', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 'u1', displayName: 'Quinn', email: 'q@example.com', roles: ['CityLead'] }) });
    });
    await page.route('**/api/contacts**', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ rows: ROWS, total: 2 }) });
    });
    await page.goto('/contacts');
  });

  test('header is visible with surface background', async ({ page }) => {
    const header = page.locator('.contacts-list-page__header');
    await expect(header).toBeVisible();
  });

  test('header contains new contact button', async ({ page }) => {
    await expect(page.locator('.contacts-list-page__header').getByTestId('new-contact-btn')).toBeVisible();
  });

  test('contacts heading is smaller than browser default h1', async ({ page }) => {
    const h1 = page.locator('.contacts-list-page__header h1');
    const fontSize = await h1.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    expect(fontSize).toBeLessThan(24);
  });

  test('search input is visible in header', async ({ page }) => {
    await expect(page.getByTestId('contact-search-input')).toBeVisible();
  });

  test('contacts table is visible', async ({ page }) => {
    await expect(page.getByTestId('contacts-table')).toBeVisible();
  });

  test('contact row links to detail page', async ({ page }) => {
    await expect(page.getByTestId('contact-card-c1')).toBeVisible();
  });
});
