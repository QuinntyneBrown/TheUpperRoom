// T169: partner list items should be styled cards, not flat divider rows
import { test, expect } from '../../fixtures';

const PARTNERS = [
  { id: 'p1', teamId: 't1', name: 'FaithTech Toronto', city: 'Toronto', stage: 'InFunnel', version: 2 },
  { id: 'p2', teamId: 't1', name: 'Redeemer Church', city: 'Calgary', stage: 'Lead', version: 1 },
];

test.describe('Partner list card styling', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json',
        body: JSON.stringify({ id: 'u1', displayName: 'Quinn', email: 'q@example.com', roles: ['CityLead'] }) });
    });
    await page.route('**/api/partners*', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(PARTNERS) });
    });
    await page.goto('/partners');
    await expect(page.getByTestId('partner-card-p1')).toBeVisible({ timeout: 5000 });
  });

  test('partner card has non-transparent background', async ({ page }) => {
    const card = page.getByTestId('partner-card-p1');
    const bg = await card.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bg).not.toBe('rgba(0, 0, 0, 0)');
    expect(bg).not.toBe('transparent');
  });

  test('partner card has border', async ({ page }) => {
    const card = page.getByTestId('partner-card-p1');
    const border = await card.evaluate((el) => getComputedStyle(el).borderStyle);
    expect(border).toBe('solid');
    const width = await card.evaluate((el) => getComputedStyle(el).borderTopWidth);
    expect(parseInt(width)).toBeGreaterThan(0);
  });

  test('partner card has border-radius', async ({ page }) => {
    const card = page.getByTestId('partner-card-p1');
    const radius = await card.evaluate((el) => getComputedStyle(el).borderRadius);
    expect(parseInt(radius)).toBeGreaterThan(0);
  });

  test('partner card is a horizontal flex row', async ({ page }) => {
    const card = page.getByTestId('partner-card-p1');
    const flexDir = await card.evaluate((el) => getComputedStyle(el).flexDirection);
    expect(flexDir).toBe('row');
  });
});
