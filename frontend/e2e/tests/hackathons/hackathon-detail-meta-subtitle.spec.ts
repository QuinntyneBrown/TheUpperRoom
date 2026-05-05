// T117 — hackathon detail meta subtitle should include "FaithTech 4 D's process"
import { test, expect } from '../../fixtures';

const HACKATHON = {
  id: 'h1',
  title: 'Spring Hackathon 2026',
  hostCity: 'Toronto',
  stage: 'Discover',
  startDate: '2026-05-18',
  endDate: '2026-05-21',
  products: [],
  partners: [],
  history: [],
};

test.describe('Hackathon detail meta subtitle', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/hackathons/h1', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(HACKATHON) });
    });
    await page.goto('/hackathons/h1');
  });

  test('meta subtitle starts with FaithTech 4 D\'s process', async ({ page }) => {
    await expect(page.locator('.hackathon-detail__meta')).toContainText("FaithTech 4 D's process");
  });

  test('meta subtitle includes host city', async ({ page }) => {
    await expect(page.locator('.hackathon-detail__meta')).toContainText('Toronto');
  });
});
