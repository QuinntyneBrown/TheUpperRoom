// BUG-170: contact-detail and contact-edit not-found "Back to
// contacts" links lack data-testids.
import { test, expect } from '../../fixtures';

test.describe('Contact not-found back-link testids', () => {
  test('contact-detail not-found back link has testid', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/contacts/c-missing', (r) => r.fulfill({
      status: 404, contentType: 'application/json', body: '{}',
    }));
    await page.goto('/contacts/c-missing');
    await expect(page.getByTestId('contact-not-found-back-link')).toBeVisible({ timeout: 10000 });
  });

  test('contact-edit not-found back link has testid', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/contacts/c-missing', (r) => r.fulfill({
      status: 404, contentType: 'application/json', body: '{}',
    }));
    await page.goto('/contacts/c-missing/edit');
    await expect(page.getByTestId('contact-edit-not-found-back-link')).toBeVisible({ timeout: 10000 });
  });
});
