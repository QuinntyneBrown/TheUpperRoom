// BUG-046: same pattern as BUG-029/045 — the delete-hackathon-dialog
// confirm button should include the hackathon name. Reuses the
// DeleteHackathonDialogData already piped through for the title fix
// (BUG-028).
import { test, expect } from '../../fixtures';

test.describe('Delete hackathon dialog button label', () => {
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

  test('confirm button reads "Delete Spring Hackathon 2026"', async ({ page }) => {
    await expect(page.getByTestId('confirm-delete-hackathon-btn')).toContainText('Delete Spring Hackathon 2026');
  });
});
