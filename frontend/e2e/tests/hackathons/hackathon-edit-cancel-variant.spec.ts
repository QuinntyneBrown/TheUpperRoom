// BUG-063: hackathon-edit cancel button uses variant="secondary"
// while the symmetrical partner-edit uses variant="ghost".
// Convention across the app (notes-panel, partner-create, etc.)
// uses ghost for cancel/dismiss actions.
import { test, expect } from '../../fixtures';

const HACKATHON = {
  id: 'h1', title: 'Spring Hackathon 2026', hostCity: 'Toronto',
  startDate: '2026-05-18', endDate: '2026-05-21', currentStage: 'Discover',
  partners: [], history: [], products: [],
};

test.describe('Hackathon-edit cancel button variant', () => {
  test('cancel button uses the ghost variant', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead', 'Admin'] }),
    }));
    await page.route('**/api/hackathons/h1', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: JSON.stringify(HACKATHON),
    }));
    await page.goto('/hackathons/h1/edit');

    const cancel = page.locator('.hackathon-edit-page ur-button', { hasText: 'Cancel' });
    await expect(cancel).toBeVisible({ timeout: 10000 });
    await expect(cancel).toHaveAttribute('variant', 'ghost');
  });
});
