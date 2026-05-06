// BUG-028: same pattern as BUG-020/021 — the delete-hackathon dialog
// title should include the hackathon name.
import { test, expect } from '../../fixtures';

test.describe('Delete hackathon dialog title', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead', 'Admin'] }),
    }));
    await page.route('**/api/hackathons/h1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'h1', title: 'Spring Hackathon 2026', hostCity: 'Toronto',
        startDate: '2026-05-18', endDate: '2026-05-21', currentStage: 'Discover',
        partners: [], history: [], products: [],
      }),
    }));
    await page.goto('/hackathons/h1');
    await expect(page.getByTestId('hackathon-more-btn')).toBeVisible({ timeout: 10000 });
    await page.getByTestId('hackathon-more-btn').click();
    await page.getByTestId('hackathon-delete-menu-item').click();
    await expect(page.getByTestId('hackathon-delete-dialog')).toBeVisible();
  });

  test('title includes the hackathon name', async ({ page }) => {
    const dialog = page.getByTestId('hackathon-delete-dialog');
    await expect(dialog).toContainText('Spring Hackathon 2026');
  });
});
