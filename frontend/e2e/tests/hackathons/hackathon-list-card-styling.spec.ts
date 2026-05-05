// T164: hackathon list cards should be styled with bg-elevated, accent border, and a stage badge
import { test, expect } from '../../fixtures';

const ROWS = [
  { id: 'h1', title: 'FaithTech Hackathon 2025', hostCity: 'Toronto', startDate: '2025-06-01', endDate: '2025-06-03', currentStage: 'Discover' },
  { id: 'h2', title: 'Build Weekend NYC', hostCity: 'New York', startDate: '2025-09-15', endDate: '2025-09-17', currentStage: 'Deploy' },
];

test.describe('Hackathon list card styling', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json',
        body: JSON.stringify({ id: 'u1', displayName: 'Quinn', email: 'q@example.com', roles: ['CityLead'] }) });
    });
    await page.route('**/api/hackathons', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(ROWS) });
    });
    await page.goto('/hackathons');
    await expect(page.getByTestId('hackathon-card-h1')).toBeVisible({ timeout: 5000 });
  });

  test('hackathon card has a non-transparent background', async ({ page }) => {
    const card = page.getByTestId('hackathon-card-h1');
    const bg = await card.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bg).not.toBe('rgba(0, 0, 0, 0)');
    expect(bg).not.toBe('transparent');
  });

  test('hackathon card has a visible border', async ({ page }) => {
    const card = page.getByTestId('hackathon-card-h1');
    const bw = await card.evaluate((el) => getComputedStyle(el).borderTopWidth);
    expect(parseFloat(bw)).toBeGreaterThanOrEqual(1);
  });

  test('hackathon card has border-radius', async ({ page }) => {
    const card = page.getByTestId('hackathon-card-h1');
    const br = await card.evaluate((el) => getComputedStyle(el).borderRadius);
    expect(parseFloat(br)).toBeGreaterThan(0);
  });

  test('stage badge is visible on card', async ({ page }) => {
    const badge = page.getByTestId('hackathon-card-h1').getByTestId('hackathon-stage-badge');
    await expect(badge).toBeVisible();
    await expect(badge).toContainText('Discover');
  });

  test('hackathon list page header has bg-elevated background', async ({ page }) => {
    const header = page.locator('.hackathon-list-page__header');
    const bg = await header.evaluate((el) => getComputedStyle(el).backgroundColor);
    // bg-elevated is #101018 — rgb(16, 16, 24)
    expect(bg).toBe('rgb(16, 16, 24)');
  });
});
