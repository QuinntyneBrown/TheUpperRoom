// T125 — hackathon list cards should have card-style layout
import { test, expect } from '../../fixtures';

const ROWS = [
  { id: 'h1', title: 'FaithTech Toronto 2026', hostCity: 'Toronto', startDate: '2026-05-18', endDate: '2026-05-21', currentStage: 'Discover' },
  { id: 'h2', title: 'Mountain Top Hack', hostCity: 'Vancouver', startDate: '2026-06-01', endDate: '2026-06-03', currentStage: 'Design' },
];

test.describe('Hackathon list card layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 'u1', displayName: 'Quinn', email: 'q@example.com', roles: ['CityLead'] }) });
    });
    await page.route('**/api/hackathons**', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(ROWS) });
    });
    await page.goto('/hackathons');
  });

  test('hackathon card is a block element (not inline)', async ({ page }) => {
    const card = page.getByTestId('hackathon-card-h1');
    const box = await card.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(100);
  });

  test('second card appears below first card', async ({ page }) => {
    const first = page.getByTestId('hackathon-card-h1');
    const second = page.getByTestId('hackathon-card-h2');
    const firstBox = await first.boundingBox();
    const secondBox = await second.boundingBox();
    expect(secondBox!.y).toBeGreaterThan(firstBox!.y);
  });

  test('hackathon title is visible in card', async ({ page }) => {
    await expect(page.getByTestId('hackathon-card-h1')).toContainText('FaithTech Toronto 2026');
  });

  test('meta text is visible in card', async ({ page }) => {
    await expect(page.getByTestId('hackathon-card-h1')).toContainText('Toronto');
  });

  test('page header is visible', async ({ page }) => {
    await expect(page.locator('.hackathon-list-page__header')).toBeVisible();
  });
});
