// T140 — partner contacts panel must have dark-themed inputs and proper layout
import { test, expect } from '../../fixtures';

const PARTNER = { id: 'p1', name: 'Acme Corp', city: 'Toronto', stage: 'InFunnel', website: 'https://acme.com', description: '', version: 1, contacts: [], notes: [], history: [] };

test.describe('Partner contacts panel CSS', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 'u1', displayName: 'Quinn', email: 'q@test.com', roles: ['CityLead'] }) }));
    await page.route('**/api/partners/p1', r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(PARTNER) }));
    await page.goto('/partners/p1', { waitUntil: 'load' });
    await page.waitForSelector('[data-testid=partner-detail]', { timeout: 8000 });
    await page.click('[data-testid=add-contact-btn]');
    await page.waitForSelector('[data-testid=new-contact-form]', { timeout: 3000 });
  });

  test('new contact form first name input has dark background', async ({ page }) => {
    const bg = await page.getByTestId('new-contact-first-name').evaluate(el => getComputedStyle(el).backgroundColor);
    expect(bg).not.toBe('rgb(255, 255, 255)');
  });

  test('first name and last name inputs are in a flex row', async ({ page }) => {
    const row = page.locator('.partner-contacts__new-row');
    const display = await row.evaluate(el => getComputedStyle(el).display);
    expect(display).toBe('flex');
  });

  test('contacts panel header is flex layout', async ({ page }) => {
    const hd = page.locator('.partner-contacts__hd');
    const display = await hd.evaluate(el => getComputedStyle(el).display);
    expect(display).toBe('flex');
  });
});
