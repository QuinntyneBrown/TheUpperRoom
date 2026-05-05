// T106 — Hackathon detail stage selector should show the 4 D's: Discover, Design, Develop, Deploy
import { test, expect } from '../../fixtures';

const HACKATHON = { id: 'h1', title: 'FaithTech 2024', hostCity: 'Toronto', startDate: '2024-03-01', endDate: '2024-03-03', stage: 'Design', history: [], partners: [], products: [] };

test.describe('Hackathon detail stage names', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 'u1', displayName: 'Test', email: 'test@example.com', roles: ['CityLead'] }) });
    });
    await page.route('**/api/hackathons/h1', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(HACKATHON) });
    });
    await page.goto('/hackathons/h1');
  });

  test('shows exactly 4 stage buttons', async ({ page }) => {
    const region = page.getByRole('region', { name: "4 D's stage" });
    await expect(region.getByRole('button')).toHaveCount(4);
  });

  test('stage buttons are Discover, Design, Develop, Deploy', async ({ page }) => {
    const region = page.getByRole('region', { name: "4 D's stage" });
    await expect(region.getByRole('button', { name: 'Discover' })).toBeVisible();
    await expect(region.getByRole('button', { name: 'Design' })).toBeVisible();
    await expect(region.getByRole('button', { name: 'Develop' })).toBeVisible();
    await expect(region.getByRole('button', { name: 'Deploy' })).toBeVisible();
  });

  test('no Define button exists', async ({ page }) => {
    const region = page.getByRole('region', { name: "4 D's stage" });
    await expect(region.getByRole('button', { name: 'Define' })).not.toBeVisible();
  });

  test('no Launch button exists', async ({ page }) => {
    const region = page.getByRole('region', { name: "4 D's stage" });
    await expect(region.getByRole('button', { name: 'Launch' })).not.toBeVisible();
  });
});
