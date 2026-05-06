// BUG-084: partner-detail toast/banner icons inside role containers
// lack aria-hidden="true". Mirrors BUG-080..083.
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

test.describe('Partner-detail toast icons are aria-hidden', () => {
  test('partner-saved-toast icon has aria-hidden="true"', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: 'u1', displayName: 'Quinn', email: 'q@example.com', roles: ['CityLead'] }),
    }));
    await page.route('**/api/partners/p1', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: JSON.stringify(PARTNER),
    }));

    await page.goto('/partners/p1?saved=1');
    await expect(page.getByTestId('partner-saved-toast')).toBeVisible({ timeout: 10000 });

    const icon = page.locator('[data-testid="partner-saved-toast"] mat-icon');
    await expect(icon).toHaveAttribute('aria-hidden', 'true');
  });
});
