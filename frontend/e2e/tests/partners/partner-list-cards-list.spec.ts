// BUG-206: partner-list cards should render as <ul><li>.
import { test, expect } from '../../fixtures';

test.describe('Partner list cards list semantics', () => {
  test('partner cards render in a <ul aria-label> with <li> rows', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/partners', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify([
        { id: 'p1', name: 'Mountain Top Church', city: 'Toronto', stage: 'Lead' },
        { id: 'p2', name: 'Hope Centre', city: 'Vancouver', stage: 'Confirmed' },
      ]),
    }));
    await page.goto('/partners');
    const ul = page.locator('ul.partner-list-page__cards');
    await expect(ul).toBeVisible({ timeout: 10000 });
    await expect(ul).toHaveAttribute('aria-label', /partners/i);
    expect(await ul.locator('> li').count()).toBe(2);
  });
});
