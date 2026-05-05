// T154: clicking "+ New contact" should open a modal dialog, not navigate to /contacts/new
import { test, expect } from '../../fixtures';

test.describe('New contact dialog', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/contacts*', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ rows: [], total: 0 }) });
    });
    await page.goto('/contacts');
  });

  test('clicking "+ New contact" stays on /contacts and shows a dialog', async ({ page }) => {
    await page.getByTestId('new-contact-btn').click();
    await expect(page).toHaveURL('/contacts');
    await expect(page.getByRole('dialog', { name: 'New contact' })).toBeVisible();
  });

  test('dialog has "New contact" heading', async ({ page }) => {
    await page.getByTestId('new-contact-btn').click();
    await expect(page.getByRole('heading', { name: 'New contact' })).toBeVisible();
  });

  test('Cancel button closes the dialog', async ({ page }) => {
    await page.getByTestId('new-contact-btn').click();
    await expect(page.getByRole('dialog', { name: 'New contact' })).toBeVisible();
    await page.getByTestId('new-contact-dialog-cancel').click();
    await expect(page.getByRole('dialog', { name: 'New contact' })).not.toBeVisible();
  });

  test('Save contact button is disabled until required fields are filled', async ({ page }) => {
    await page.getByTestId('new-contact-btn').click();
    await expect(page.getByTestId('new-contact-dialog-submit')).toBeDisabled();
    await page.getByLabel('First name').fill('Sam');
    await page.getByLabel('Last name').fill('Reyes');
    await page.getByLabel('Email').fill('sam@church.org');
    await expect(page.getByTestId('new-contact-dialog-submit')).toBeEnabled();
  });
});
