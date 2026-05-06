// BUG-061: hackathon-edit form labels use Title Case (Start Date,
// End Date, Host City) while hackathon-create uses sentence case
// (Start date, End date, Host city). Normalize for consistency.
import { test, expect } from '../../fixtures';

const HACKATHON = {
  id: 'h1', title: 'Spring Hackathon 2026', hostCity: 'Toronto',
  startDate: '2026-05-18', endDate: '2026-05-21', currentStage: 'Discover',
  partners: [], history: [], products: [],
};

test.describe('Hackathon-edit form label case', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead', 'Admin'] }),
    }));
    await page.route('**/api/hackathons/h1', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: JSON.stringify(HACKATHON),
    }));
    await page.goto('/hackathons/h1/edit');
    await expect(page.getByTestId('hackathon-edit-save-btn')).toBeVisible({ timeout: 10000 });
  });

  test('"Start date" label uses sentence case', async ({ page }) => {
    await expect(page.locator('.hackathon-edit-page label', { hasText: /^\s*Start date\s/ })).toBeVisible();
  });

  test('"End date" label uses sentence case', async ({ page }) => {
    await expect(page.locator('.hackathon-edit-page label', { hasText: /^\s*End date\s/ })).toBeVisible();
  });

  test('"Host city" label uses sentence case', async ({ page }) => {
    await expect(page.locator('.hackathon-edit-page label', { hasText: /^\s*Host city\s/ })).toBeVisible();
  });
});
