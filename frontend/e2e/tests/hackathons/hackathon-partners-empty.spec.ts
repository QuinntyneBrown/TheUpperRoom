// BUG-077: hackathon-detail Partners section is hidden when
// h.partners is empty. Show a structured empty state instead, matching
// BUG-076 (stage history).
import { test, expect } from '../../fixtures';

const HACKATHON = {
  id: 'h1', title: 'Spring Hackathon 2026', hostCity: 'Toronto',
  startDate: '2026-05-18', endDate: '2026-05-21', currentStage: 'Discover',
  partners: [], history: [], products: [],
};

test.describe('Hackathon-detail partners empty state', () => {
  test('shows an empty-state h2 when partners is empty', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead', 'Admin'] }),
    }));
    await page.route('**/api/hackathons/h1', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: JSON.stringify(HACKATHON),
    }));
    await page.goto('/hackathons/h1');
    await expect(page.getByTestId('hackathon-detail')).toBeVisible({ timeout: 10000 });

    const title = page.getByTestId('hackathon-partners-empty-title');
    await expect(title).toHaveJSProperty('tagName', 'H2');
    await expect(title).toHaveText('No partners linked yet.');
  });
});
