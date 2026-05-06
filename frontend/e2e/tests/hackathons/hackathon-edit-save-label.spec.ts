// BUG-062: hackathon-edit save button reads "Save"; symmetrical
// partner-edit and contact-edit both use "Save changes". Normalize
// for cross-feature consistency.
import { test, expect } from '../../fixtures';

const HACKATHON = {
  id: 'h1', title: 'Spring Hackathon 2026', hostCity: 'Toronto',
  startDate: '2026-05-18', endDate: '2026-05-21', currentStage: 'Discover',
  partners: [], history: [], products: [],
};

test.describe('Hackathon-edit save button label', () => {
  test('save button reads "Save changes"', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead', 'Admin'] }),
    }));
    await page.route('**/api/hackathons/h1', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: JSON.stringify(HACKATHON),
    }));
    await page.goto('/hackathons/h1/edit');

    const saveBtn = page.getByTestId('hackathon-edit-save-btn');
    await expect(saveBtn).toBeVisible({ timeout: 10000 });
    await expect(saveBtn).toHaveText('Save changes');
  });
});
