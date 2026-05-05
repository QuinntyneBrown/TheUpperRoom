// T133 — widget catalog dialog must have correct CSS (stacked label+desc, no bullets)
import { test, expect } from '../../fixtures';

test.describe('Widget catalog dialog CSS', () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 'u1', displayName: 'Quinn', email: 'q@example.com', roles: ['CityLead'] }) });
    });
    await page.route('**/api/dashboard**', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ json: '{"items":[]}' }) });
    });
    await page.goto('/dashboard', { waitUntil: 'load' });
    await page.getByTestId('add-widget-btn').click();
    await expect(page.getByTestId('widget-catalog-dialog')).toBeVisible();
  });

  test('widget label and description are stacked vertically, not side by side', async ({ page }) => {
    const label = page.locator('.widget-catalog-dialog__label').first();
    const desc = page.locator('.widget-catalog-dialog__desc').first();
    const labelBox = await label.boundingBox();
    const descBox = await desc.boundingBox();
    // desc must be below the label (y > label bottom)
    expect(descBox!.y).toBeGreaterThan(labelBox!.y + labelBox!.height - 4);
  });

  test('widget list has no visible bullet markers', async ({ page }) => {
    const listStyle = await page.locator('.widget-catalog-dialog__list').evaluate(
      (el) => getComputedStyle(el).listStyleType
    );
    expect(listStyle).toBe('none');
  });

  test('widget entries are separated by visible spacing or border', async ({ page }) => {
    const entries = page.locator('.widget-catalog-dialog__entry');
    const count = await entries.count();
    expect(count).toBeGreaterThanOrEqual(2);
    const firstBox = await entries.nth(0).boundingBox();
    const secondBox = await entries.nth(1).boundingBox();
    // second entry must start below first entry
    expect(secondBox!.y).toBeGreaterThan(firstBox!.y);
  });

  test('widget label is visually distinct from description (different color or weight)', async ({ page }) => {
    const labelColor = await page.locator('.widget-catalog-dialog__label').first().evaluate(
      (el) => getComputedStyle(el).color
    );
    const descColor = await page.locator('.widget-catalog-dialog__desc').first().evaluate(
      (el) => getComputedStyle(el).color
    );
    // label and desc should have different colors OR label should be bold
    const labelWeight = await page.locator('.widget-catalog-dialog__label').first().evaluate(
      (el) => getComputedStyle(el).fontWeight
    );
    const isDistinct = labelColor !== descColor || parseInt(labelWeight) >= 600;
    expect(isDistinct).toBe(true);
  });
});
