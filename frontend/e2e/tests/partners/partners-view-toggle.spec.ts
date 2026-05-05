// T170: partners list and board pages must show a list/board view toggle in the header
import { test, expect } from '../../fixtures';

const PARTNERS = [
  { id: 'p1', teamId: 't1', name: 'FaithTech Toronto', city: 'Toronto', stage: 'InFunnel', version: 1 },
];

test.describe('Partners view toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json',
        body: JSON.stringify({ id: 'u1', displayName: 'Quinn', email: 'q@example.com', roles: ['CityLead'] }) }));
    await page.route('**/api/partners*', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(PARTNERS) }));
  });

  test('list page shows view toggle with list tab active', async ({ page }) => {
    await page.goto('/partners');
    await expect(page.getByTestId('partners-list-tab')).toBeVisible({ timeout: 5000 });
    await expect(page.getByTestId('partners-board-tab')).toBeVisible();
  });

  test('board page shows view toggle with board tab active', async ({ page }) => {
    await page.goto('/partners/board');
    await expect(page.getByTestId('partners-list-tab')).toBeVisible({ timeout: 5000 });
    await expect(page.getByTestId('partners-board-tab')).toBeVisible();
  });

  test('board tab on list page navigates to /partners/board', async ({ page }) => {
    await page.goto('/partners');
    await page.getByTestId('partner-card-p1').waitFor({ timeout: 5000 });
    await page.getByTestId('partners-board-tab').click();
    await expect(page).toHaveURL(/\/partners\/board/);
  });

  test('list tab on board page navigates to /partners', async ({ page }) => {
    await page.goto('/partners/board');
    await expect(page.getByTestId('partner-board')).toBeVisible({ timeout: 5000 });
    await page.getByTestId('partners-list-tab').click();
    await expect(page).toHaveURL(/\/partners$/);
  });
});
