// BUG-059: partner-edit "Edit partner" heading is currently <h2>;
// contact-edit and hackathon-edit both use <h1>. Promote for
// cross-feature consistency.
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

test.describe('Partner-edit heading element', () => {
  test('"Edit partner" is rendered as an h1', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: 'u1', displayName: 'Quinn', email: 'q@example.com', roles: ['CityLead'] }),
    }));
    await page.route('**/api/partners/p1', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: JSON.stringify(PARTNER),
    }));
    await page.goto('/partners/p1/edit');
    await expect(page.getByTestId('partner-edit')).toBeVisible({ timeout: 10000 });

    const heading = page.getByTestId('partner-edit-heading');
    await expect(heading).toHaveJSProperty('tagName', 'H1');
    await expect(heading).toHaveText('Edit partner');
  });
});
