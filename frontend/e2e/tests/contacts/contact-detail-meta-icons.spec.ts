// T115 — contact detail meta fields use icons not bold labels
import { test, expect } from '../../fixtures';

const CONTACT = {
  id: 'c1',
  firstName: 'Sarah',
  lastName: 'Mensah',
  email: 'sarah@hopecity.org',
  phone: '+1 416 555 0117',
  city: 'Toronto',
  notes: [],
};

test.describe('Contact detail meta icons', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/contacts/c1', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(CONTACT) });
    });
    await page.goto('/contacts/c1');
  });

  test('email row has mail icon and no bold label', async ({ page }) => {
    const emailRow = page.getByTestId('contact-meta-email');
    await expect(emailRow).toContainText('sarah@hopecity.org');
    await expect(emailRow.locator('mat-icon')).toHaveText('mail');
    await expect(emailRow).not.toContainText('Email:');
  });

  test('phone row has call icon and no bold label', async ({ page }) => {
    const phoneRow = page.getByTestId('contact-meta-phone');
    await expect(phoneRow).toContainText('+1 416 555 0117');
    await expect(phoneRow.locator('mat-icon')).toHaveText('call');
    await expect(phoneRow).not.toContainText('Phone:');
  });

  test('city row has location_on icon and no bold label', async ({ page }) => {
    const cityRow = page.getByTestId('contact-meta-city');
    await expect(cityRow).toContainText('Toronto');
    await expect(cityRow.locator('mat-icon')).toHaveText('location_on');
    await expect(cityRow).not.toContainText('City:');
  });
});
