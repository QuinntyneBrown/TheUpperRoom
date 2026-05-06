// BUG-162: partner-create stage picker is mutually-exclusive button
// options. Mark up as a radiogroup with role="radio" + aria-checked.
import { test, expect } from '../../fixtures';

test.describe('Partner-create stage radiogroup', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/partners', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: '[]',
    }));
    await page.goto('/partners');
    await expect(page.getByTestId('new-partner-btn')).toBeVisible({ timeout: 10000 });
    await page.getByTestId('new-partner-btn').click();
    await expect(page.getByTestId('partner-create-form')).toBeVisible();
  });

  test('stage container has role="radiogroup"', async ({ page }) => {
    const dialog = page.getByTestId('partner-create-form');
    const group = dialog.locator('[role="radiogroup"]');
    await expect(group).toBeVisible();
  });

  test('each stage option has role="radio" and aria-checked', async ({ page }) => {
    const dialog = page.getByTestId('partner-create-form');
    const radios = dialog.locator('[role="radio"]');
    const count = await radios.count();
    expect(count).toBeGreaterThan(0);
    let checkedCount = 0;
    for (let i = 0; i < count; i++) {
      const checked = await radios.nth(i).getAttribute('aria-checked');
      expect(['true', 'false']).toContain(checked);
      if (checked === 'true') checkedCount++;
    }
    expect(checkedCount).toBe(1);
  });
});
