// BUG-085: partner-contacts remove button has aria-label="Remove" for
// every contact row — screen-reader users navigating the list can't
// distinguish between rows. Personalize with the contact name.
import { test, expect } from '../../fixtures';

const PARTNER = {
  id: 'p1',
  name: 'Mountain Top Church',
  city: 'Toronto',
  stage: 'Lead',
  description: '',
  website: '',
  contacts: [
    { id: 'c1', firstName: 'Sam', lastName: 'Reyes', email: 'sam@example.com' },
    { id: 'c2', firstName: 'Sarah', lastName: 'Mensah', email: 'sarah@example.com' },
  ],
  notes: [],
  history: [],
};

test.describe('Partner-contacts remove button aria-label', () => {
  test('aria-label includes the contact name', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: 'u1', displayName: 'Quinn', email: 'q@example.com', roles: ['CityLead'] }),
    }));
    await page.route('**/api/partners/p1', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: JSON.stringify(PARTNER),
    }));
    await page.goto('/partners/p1');
    await expect(page.getByTestId('contact-row-c1')).toBeVisible({ timeout: 10000 });

    await expect(page.getByRole('button', { name: 'Remove Sam Reyes' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Remove Sarah Mensah' })).toBeVisible();
  });
});
