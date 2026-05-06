// BUG-060: hackathon-edit heading uses Title Case "Edit Hackathon"
// while contact-edit and partner-edit both use sentence case
// ("Edit contact" / "Edit partner"). Normalize to sentence case.
import { test, expect } from '../../fixtures';

const HACKATHON = {
  id: 'h1', title: 'Spring Hackathon 2026', hostCity: 'Toronto',
  startDate: '2026-05-18', endDate: '2026-05-21', currentStage: 'Discover',
  partners: [], history: [], products: [],
};

test.describe('Hackathon-edit heading case', () => {
  test('heading reads "Edit hackathon" (sentence case)', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead', 'Admin'] }),
    }));
    await page.route('**/api/hackathons/h1', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: JSON.stringify(HACKATHON),
    }));
    await page.goto('/hackathons/h1/edit');

    const heading = page.locator('.hackathon-edit-page h1');
    await expect(heading).toBeVisible({ timeout: 10000 });
    await expect(heading).toHaveText('Edit hackathon');
  });
});
