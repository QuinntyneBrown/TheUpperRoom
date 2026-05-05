// T167: hackathon 4 D's cards should render as a horizontal row, not a vertical stack
import { test, expect } from '../../fixtures';

const HACKATHON = {
  id: 'h1', teamId: 't1', title: 'FaithTech Spring 2025', hostCity: 'Toronto',
  startDate: '2025-06-01', endDate: '2025-06-03', stage: 'Design', version: 2,
  history: [], products: [], partners: [],
};

test.describe('Hackathon 4 D\'s cards layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json',
        body: JSON.stringify({ id: 'u1', displayName: 'Quinn', email: 'q@example.com', roles: ['CityLead'] }) });
    });
    await page.route('**/api/hackathons/h1', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(HACKATHON) });
    });
    await page.goto('/hackathons/h1');
    await expect(page.getByTestId('d-card-Discover')).toBeVisible({ timeout: 5000 });
  });

  test('four-d cards container is a horizontal flex row', async ({ page }) => {
    const container = page.locator('.four-d-cards');
    const flexDir = await container.evaluate((el) => getComputedStyle(el).flexDirection);
    expect(flexDir).toBe('row');
  });

  test('d-card has 8px border-radius', async ({ page }) => {
    const card = page.getByTestId('d-card-Discover');
    const radius = await card.evaluate((el) => getComputedStyle(el).borderRadius);
    expect(radius).toBe('8px');
  });

  test('d-card background is bg-elevated (#101018)', async ({ page }) => {
    const card = page.getByTestId('d-card-Develop');
    const bg = await card.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bg).toBe('rgb(16, 16, 24)');
  });

  test('active d-card has accent-primary border', async ({ page }) => {
    const card = page.getByTestId('d-card-Design');
    const border = await card.evaluate((el) => getComputedStyle(el).borderColor);
    expect(border).toBe('rgb(159, 134, 255)');
  });
});
