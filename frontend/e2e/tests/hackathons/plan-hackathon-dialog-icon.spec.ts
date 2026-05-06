// BUG-109: hackathon-create dialog (Plan hackathon) doesn't pass an
// icon to ur-dialog so the accent circle never renders. Mirrors peer
// create dialogs.
import { test, expect } from '../../fixtures';

test.describe('Plan-hackathon dialog icon', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/hackathons**', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: '[]',
    }));
    await page.route('**/api/partners**', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: '[]',
    }));
    await page.goto('/hackathons/new');
    await expect(page.getByTestId('hackathon-create-form')).toBeVisible({ timeout: 10000 });
  });

  test('renders the accent icon circle with an icon', async ({ page }) => {
    const iconWrap = page.locator('[data-testid="hackathon-create-form"] .ur-dialog__icon');
    await expect(iconWrap).toBeVisible();
    await expect(iconWrap.locator('mat-icon')).toBeVisible();
  });
});
