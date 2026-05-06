// BUG-137: hackathon-detail section h2 titles lack testids while
// sibling content uses testids extensively. Mirrors heading-testid
// pattern.
import { test, expect } from '../../fixtures';

test.describe('Hackathon detail section title testids', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/hackathons/h1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'h1', title: 'Spring Hack', startsOn: '2026-05-01', endsOn: '2026-05-03',
        hostCity: 'Toronto', partners: [], products: [], history: [], version: 1,
      }),
    }));
    await page.goto('/hackathons/h1');
    await expect(page.getByTestId('hackathon-detail')).toBeVisible({ timeout: 10000 });
  });

  test('Partners section h2 has testid hackathon-partners-section-title', async ({ page }) => {
    const title = page.getByTestId('hackathon-partners-section-title');
    await expect(title).toHaveText('Partners');
  });

  test('Stage history section h2 has testid hackathon-history-section-title', async ({ page }) => {
    const title = page.getByTestId('hackathon-history-section-title');
    await expect(title).toHaveText('Stage history');
  });
});
