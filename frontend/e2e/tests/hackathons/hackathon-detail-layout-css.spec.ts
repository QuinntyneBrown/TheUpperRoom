// T142 — hackathon detail page must have flex header, styled back link, and body gap
import { test, expect } from '../../fixtures';

const HACK = { id: 'h1', teamId: 't1', title: 'East Side Hackathon', hostCity: 'Toronto', startDate: '2026-05-18', endDate: '2026-05-21', stage: 'Design', version: 2, history: [{ id: 'e1', fromStage: 'Discover', toStage: 'Design', changedById: 'u1', changedAt: '2026-04-01T10:00:00Z' }], products: [], partners: [] };

test.describe('Hackathon detail layout CSS', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 'u1', displayName: 'Quinn', email: 'q@test.com', roles: ['CityLead'] }) }));
    await page.route('**/api/hackathons/h1', r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(HACK) }));
    await page.goto('/hackathons/h1', { waitUntil: 'load' });
    await page.waitForSelector('[data-testid=hackathon-detail]', { timeout: 8000 });
  });

  test('hackathon detail header is flex row', async ({ page }) => {
    const header = page.locator('.hackathon-detail__header');
    const display = await header.evaluate(el => getComputedStyle(el).display);
    expect(display).toBe('flex');
  });

  test('header actions are on the right side', async ({ page }) => {
    const actions = page.locator('.hackathon-detail__header-actions');
    const display = await actions.evaluate(el => getComputedStyle(el).display);
    expect(display).toBe('flex');
  });

  test('back link has color styling', async ({ page }) => {
    const link = page.locator('.hackathon-detail__back');
    const color = await link.evaluate(el => getComputedStyle(el).color);
    expect(color).not.toBe('rgb(0, 0, 0)');
  });

  test('hackathon detail body has padding', async ({ page }) => {
    const body = page.locator('.hackathon-detail__body');
    const padding = await body.evaluate(el => getComputedStyle(el).padding);
    expect(padding).not.toBe('0px');
  });

  test('history item is flex row', async ({ page }) => {
    const item = page.locator('.hackathon-history__item').first();
    const display = await item.evaluate(el => getComputedStyle(el).display);
    expect(display).toBe('flex');
  });
});
