import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Contact detail breadcrumb and kebab menu', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test.beforeEach(async ({ auth, page }) => {
    await auth.signInAs('city-lead');
    const contact = { id: 'c-nav1', firstName: 'Alice', lastName: 'Smith', email: 'alice@example.com', phone: '', city: 'Toronto', notes: [], deletedAt: null };
    await page.route('**/api/contacts/c-nav1', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(contact) });
    });
    await page.goto('/contacts/c-nav1');
    await expect(page.getByTestId('contact-detail')).toBeVisible({ timeout: 3000 });
  });

  test('breadcrumb link to contacts list is visible', async ({ page }) => {
    await expect(page.getByTestId('contact-breadcrumb-link')).toBeVisible();
  });

  test('breadcrumb link navigates to /contacts', async ({ page }) => {
    const link = page.getByTestId('contact-breadcrumb-link');
    await expect(link).toHaveAttribute('href', '/contacts');
  });

  test('contact name appears in breadcrumb area', async ({ page }) => {
    await expect(page.getByTestId('contact-breadcrumb-name')).toContainText('Alice Smith');
  });

  test('kebab menu button is visible in header', async ({ page }) => {
    await expect(page.getByTestId('contact-more-btn')).toBeVisible();
  });

  test('kebab menu contains delete option', async ({ page }) => {
    await page.getByTestId('contact-more-btn').click();
    await expect(page.getByTestId('contact-delete-menu-item')).toBeVisible();
  });

  test('no explicit delete button in header (delete moved to kebab)', async ({ page }) => {
    await expect(page.getByTestId('contact-delete-btn')).toHaveCount(0);
  });
});
