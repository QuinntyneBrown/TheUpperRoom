// T146 — ur-button ghost/outline/danger variants must render text content
import { test, expect } from '../../fixtures';

const ME = { id: 'u1', displayName: 'Quinn', email: 'q@test.com', roles: ['CityLead'] };
const HACK = { id: 'h1', teamId: 't1', title: 'East Side Hackathon', hostCity: 'Toronto', startDate: '2026-05-18', endDate: '2026-05-21', stage: 'Design', version: 2, history: [], products: [], partners: [] };

test.describe('ur-button ghost content projection', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(ME) }));
    await page.route('**/api/hackathons/h1', r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(HACK) }));
    await page.goto('/hackathons/h1', { waitUntil: 'load' });
    await page.waitForSelector('[data-testid=add-product-btn]', { timeout: 8000 });
    await page.click('[data-testid=add-product-btn]');
    await page.waitForSelector('[data-testid=add-product-dialog]', { timeout: 3000 });
  });

  test('Cancel button in product form has visible text', async ({ page }) => {
    const cancel = page.locator('[data-testid=add-product-dialog] .product-form__actions ur-button[variant=ghost]');
    await expect(cancel).toBeVisible();
    const label = cancel.locator('.ur-button__label');
    const text = await label.textContent();
    expect(text?.trim()).toBe('Cancel');
  });

  test('Cancel button in product form has non-zero width', async ({ page }) => {
    const cancel = page.locator('[data-testid=add-product-dialog] .product-form__actions ur-button[variant=ghost]');
    const box = await cancel.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(0);
  });
});
