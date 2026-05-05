// T143 — products section must have dark-themed form inputs and flex header
import { test, expect } from '../../fixtures';

const HACK = { id: 'h1', teamId: 't1', title: 'East Side Hackathon', hostCity: 'Toronto', startDate: '2026-05-18', endDate: '2026-05-21', stage: 'Design', version: 2, history: [], products: [], partners: [] };

test.describe('Products section CSS', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 'u1', displayName: 'Quinn', email: 'q@test.com', roles: ['CityLead'] }) }));
    await page.route('**/api/hackathons/h1', r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(HACK) }));
    await page.goto('/hackathons/h1', { waitUntil: 'load' });
    await page.waitForSelector('[data-testid=add-product-btn]', { timeout: 8000 });
    await page.click('[data-testid=add-product-btn]');
    await page.waitForSelector('[data-testid=add-product-dialog]', { timeout: 3000 });
  });

  test('product form name input has dark background', async ({ page }) => {
    const input = page.locator('#productName');
    const bg = await input.evaluate(el => getComputedStyle(el).backgroundColor);
    expect(bg).not.toBe('rgb(255, 255, 255)');
  });

  test('products section header is flex row', async ({ page }) => {
    const header = page.locator('.products-section__header');
    const display = await header.evaluate(el => getComputedStyle(el).display);
    expect(display).toBe('flex');
  });

  test('product form row is flex layout', async ({ page }) => {
    const row = page.locator('.product-form__row');
    const display = await row.evaluate(el => getComputedStyle(el).display);
    expect(display).toBe('flex');
  });
});
