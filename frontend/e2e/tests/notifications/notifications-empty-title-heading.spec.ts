// BUG-208: notifications empty-title should be a heading.
import { test, expect } from '../../fixtures';

test.describe('Notifications empty title heading', () => {
  test('empty title is a heading element', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/notifications**', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify([]),
    }));
    await page.goto('/');
    await page.getByTestId('notification-bell').click();
    const title = page.getByTestId('notifications-empty-title');
    await expect(title).toBeVisible({ timeout: 10000 });
    const tag = await title.evaluate(el => el.tagName.toLowerCase());
    expect(['h1', 'h2', 'h3']).toContain(tag);
  });
});
