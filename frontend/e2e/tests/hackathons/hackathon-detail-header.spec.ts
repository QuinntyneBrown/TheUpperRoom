// T95 — hackathon detail header must have kebab menu, no explicit delete button
import { test, expect } from '../../fixtures';

const HACKATHON = {
  id: 'h-t95',
  title: 'Test Hackathon',
  hostCity: 'Toronto',
  startDate: '2026-09-01',
  endDate: '2026-09-03',
  stage: 'Discover',
  products: [],
  partners: [],
  history: [],
};

test.describe('Hackathon detail header', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/hackathons/h-t95', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(HACKATHON) });
    });
    await page.route('**/api/auth/me', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 'u1', roles: ['Admin'] }) });
    });
    await page.goto('/hackathons/h-t95');
    await expect(page.getByTestId('hackathon-title')).toBeVisible();
  });

  test('kebab menu button is visible in header', async ({ page }) => {
    await expect(page.getByTestId('hackathon-more-btn')).toBeVisible();
  });

  test('no explicit delete button in header (delete moved to kebab)', async ({ page }) => {
    await expect(page.getByTestId('hackathon-delete-btn')).toHaveCount(0);
  });

  test('delete hackathon option appears in kebab menu', async ({ page }) => {
    await page.getByTestId('hackathon-more-btn').click();
    await expect(page.getByTestId('hackathon-delete-menu-item')).toBeVisible();
  });
});
