// T122 — hackathon detail 4 D's should render as cards with status badges and descriptions
import { test, expect } from '../../fixtures';

const MOCK = {
  id: 'h1', title: 'Spring Hackathon 2026', hostCity: 'Toronto',
  startDate: '2026-05-18', endDate: '2026-05-21',
  stage: 'Design', products: [], partners: [], history: [],
};

test.describe('Hackathon detail 4 D\'s cards', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 'u1', displayName: 'Quinn', email: 'q@example.com', roles: ['CityLead'] }) });
    });
    await page.route('**/api/hackathons/h1', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK) });
    });
    await page.goto('/hackathons/h1');
  });

  test('shows four D cards', async ({ page }) => {
    await expect(page.getByTestId('d-card-Discover')).toBeVisible();
    await expect(page.getByTestId('d-card-Design')).toBeVisible();
    await expect(page.getByTestId('d-card-Develop')).toBeVisible();
    await expect(page.getByTestId('d-card-Deploy')).toBeVisible();
  });

  test('shows "D1" marker on Discover card', async ({ page }) => {
    await expect(page.getByTestId('d-card-Discover')).toContainText('D1');
  });

  test('current stage card shows "In progress" status', async ({ page }) => {
    await expect(page.getByTestId('d-card-Design')).toContainText('In progress');
  });

  test('past stage card shows "Done" status', async ({ page }) => {
    await expect(page.getByTestId('d-card-Discover')).toContainText('Done');
  });

  test('upcoming stage card shows "Upcoming" status', async ({ page }) => {
    await expect(page.getByTestId('d-card-Develop')).toContainText('Upcoming');
  });

  test('Discover card shows its description', async ({ page }) => {
    await expect(page.getByTestId('d-card-Discover')).toContainText('Identify Kingdom problems');
  });
});
