// BUG-185: partner-edit "Partner name" label has inline "*" that
// screen readers may speak as "asterisk". Wrap in aria-hidden span.
// Mirrors BUG-163/184.
import { test, expect } from '../../fixtures';

test.describe('Partner-edit asterisk aria-hidden', () => {
  test('Partner name label asterisk is aria-hidden', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/partners/p1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'p1', name: 'Mountain Top Church', city: 'Toronto', stage: 'Lead',
        contacts: [], notes: [], history: [], version: 1,
      }),
    }));
    await page.goto('/partners/p1/edit');
    await expect(page.getByTestId('partner-edit-heading')).toBeVisible({ timeout: 10000 });

    const label = page.locator('label[for="partnerName"]');
    await expect(label.locator('[aria-hidden="true"]', { hasText: '*' })).toBeVisible();
  });
});
