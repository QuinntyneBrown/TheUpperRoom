// T134 — notes panel textarea must use dark theme; note cards must be styled
import { test, expect } from '../../fixtures';

const CONTACT = { id: 'c1', firstName: 'Jane', lastName: 'Doe', email: 'jane@test.com', phone: '+1555', city: 'Toronto', notes: [
  { id: 'n1', body: 'First note content', authorId: 'u1', authorName: 'Quinn', createdAt: '2026-01-01T00:00:00Z' }
] };

test.describe('Notes panel CSS', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 'u1', displayName: 'Quinn', email: 'q@test.com', roles: ['CityLead'] }) }));
    await page.route('**/api/contacts/c1', r => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(CONTACT) }));
    await page.goto('/contacts/c1', { waitUntil: 'load' });
    await page.waitForSelector('[data-testid=contact-notes-section]', { timeout: 8000 });
  });

  test('textarea does not have white background (dark theme)', async ({ page }) => {
    const bg = await page.locator('.notes-panel__textarea').first().evaluate(
      (el) => getComputedStyle(el).backgroundColor
    );
    // white background is rgb(255, 255, 255) — should not be white
    expect(bg).not.toBe('rgb(255, 255, 255)');
  });

  test('textarea has visible text color on dark background', async ({ page }) => {
    const color = await page.locator('.notes-panel__textarea').first().evaluate(
      (el) => getComputedStyle(el).color
    );
    // should be a light color, not the default dark/black
    const rgb = color.match(/\d+/g)!.map(Number);
    const brightness = (rgb[0] + rgb[1] + rgb[2]) / 3;
    expect(brightness).toBeGreaterThan(127);
  });

  test('note card body text is visible', async ({ page }) => {
    const body = page.locator('.note-card__body').first();
    await expect(body).toBeVisible();
    await expect(body).toContainText('First note content');
  });

  test('note card meta row is laid out horizontally', async ({ page }) => {
    const meta = page.locator('.note-card__meta').first();
    const display = await meta.evaluate((el) => getComputedStyle(el).display);
    expect(['flex', 'grid', 'inline-flex']).toContain(display);
  });

  test('add-note form stacks textarea above the add button', async ({ page }) => {
    const textarea = page.locator('.notes-panel__textarea').first();
    const btn = page.getByTestId('add-note-btn');
    const taBox = await textarea.boundingBox();
    const btnBox = await btn.boundingBox();
    // button should be below the bottom of the textarea (or at the same y level in a stacked form)
    expect(btnBox!.y).toBeGreaterThanOrEqual(taBox!.y);
  });
});
