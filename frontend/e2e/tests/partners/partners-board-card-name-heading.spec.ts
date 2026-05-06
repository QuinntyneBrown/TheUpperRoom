// BUG-196: partners-board partner-card name should be a heading.
import { test, expect } from '../../fixtures';

test.describe('Partners board card name heading', () => {
  test('name is rendered as a heading', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/partners', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify([{ id: 'p1', name: 'Mountain Top Church', city: 'Toronto', stage: 'Lead' }]),
    }));
    await page.goto('/partners/board');
    const card = page.getByTestId('partner-card-p1');
    await expect(card).toBeVisible({ timeout: 10000 });
    const name = card.locator('.partner-card__name');
    await expect(name).toBeVisible();
    const tag = await name.evaluate(el => el.tagName.toLowerCase());
    expect(['h2', 'h3']).toContain(tag);
  });
});
