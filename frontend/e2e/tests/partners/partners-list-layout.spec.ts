// T126 — partners list page layout and card CSS
import { test, expect } from '../../fixtures';

const ROWS = [
  { id: 'p1', name: 'Riverside Church', city: 'Toronto', stage: 'Lead' },
  { id: 'p2', name: 'Grace Fellowship', city: 'Vancouver', stage: 'InFunnel' },
];

test.describe('Partners list layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 'u1', displayName: 'Quinn', email: 'q@example.com', roles: ['CityLead'] }) });
    });
    await page.route('**/api/partners**', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(ROWS) });
    });
    await page.goto('/partners');
  });

  test('page header is visible', async ({ page }) => {
    await expect(page.locator('.partner-list-page__header')).toBeVisible();
  });

  test('new partner button is in the header', async ({ page }) => {
    const header = page.locator('.partner-list-page__header');
    await expect(header.getByTestId('new-partner-btn')).toBeVisible();
  });

  test('partner card is a block element', async ({ page }) => {
    const card = page.getByTestId('partner-card-p1');
    const box = await card.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(100);
  });

  test('second card appears below first card', async ({ page }) => {
    const first = page.getByTestId('partner-card-p1');
    const second = page.getByTestId('partner-card-p2');
    const firstBox = await first.boundingBox();
    const secondBox = await second.boundingBox();
    expect(secondBox!.y).toBeGreaterThan(firstBox!.y);
  });

  test('partner name is visible in card', async ({ page }) => {
    await expect(page.getByTestId('partner-card-p1')).toContainText('Riverside Church');
  });

  test('partner city is visible in card meta', async ({ page }) => {
    await expect(page.getByTestId('partner-card-p1')).toContainText('Toronto');
  });
});
