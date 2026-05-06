// BUG-079: contact-detail and partner-detail breadcrumb back-arrow
// mat-icons lack aria-hidden="true". The icon is decorative; the
// adjacent link conveys the action. Without aria-hidden, screen
// readers announce "arrow_back" redundantly.
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

const CONTACT = {
  id: 'c1',
  firstName: 'Sam',
  lastName: 'Reyes',
  email: 'sam@example.com',
  phone: null,
  city: 'Toronto',
  notes: [],
};

test.describe('Detail-page breadcrumb back-arrow icons are aria-hidden', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: 'u1', displayName: 'Quinn', email: 'q@example.com', roles: ['CityLead'] }),
    }));
    await page.route('**/api/partners/p1', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: JSON.stringify(PARTNER),
    }));
    await page.route('**/api/contacts/c1', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: JSON.stringify(CONTACT),
    }));
  });

  test('partner-detail back-arrow has aria-hidden="true"', async ({ page }) => {
    await page.goto('/partners/p1');
    await expect(page.getByTestId('partner-detail')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('partner-breadcrumb-back-arrow')).toHaveAttribute('aria-hidden', 'true');
  });

  test('contact-detail back-arrow has aria-hidden="true"', async ({ page }) => {
    await page.goto('/contacts/c1');
    await expect(page.getByTestId('contact-detail')).toBeVisible({ timeout: 10000 });
    const icon = page.locator('.contact-detail__back-icon');
    await expect(icon).toHaveAttribute('aria-hidden', 'true');
  });
});
