// BUG-071: partner-detail linked-toast "Open" action uses
// <a mat-button>. Switch to ur-button variant=ghost with a navigate
// handler (mirrors BUG-068/069/070).
import { test, expect } from '../../fixtures';

const PARTNER = {
  id: 'p1',
  name: 'Mountain Top Church',
  city: 'Toronto',
  stage: 'Lead',
  description: '',
  website: '',
  contacts: [],
  notes: [],
  history: [],
};

test.describe('Partner-detail linked-contact link style', () => {
  test('"Open" action is rendered as ur-button', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: 'u1', displayName: 'Quinn', email: 'q@example.com', roles: ['CityLead'] }),
    }));
    await page.route('**/api/partners/p1', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: JSON.stringify(PARTNER),
    }));
    await page.route('**/api/partners/p1/contacts', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: 'c-new', partnerId: 'p1', firstName: 'Sarah', lastName: 'Mensah', email: 'sarah@church.org' }),
    }));

    await page.goto('/partners/p1');
    await expect(page.getByTestId('partner-contacts-panel')).toBeVisible({ timeout: 10000 });
    await page.getByTestId('add-contact-btn').click();
    await page.getByTestId('new-contact-first-name').fill('Sarah');
    await page.getByTestId('new-contact-last-name').fill('Mensah');
    await page.getByTestId('create-link-btn').click();

    await expect(page.getByTestId('linked-toast')).toBeVisible({ timeout: 5000 });
    await expect(page.getByTestId('linked-contact-link')).toHaveJSProperty('tagName', 'UR-BUTTON');
  });
});
