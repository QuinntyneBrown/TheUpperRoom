// BUG-173: partner-stepper has decorative dots and dividers that
// lack aria-hidden, so screen readers may stop on empty elements.
import { test, expect } from '../../fixtures';

test.describe('Partner stepper decorative aria-hidden', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/partners/p1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'p1', name: 'Mountain Top', city: 'Toronto', stage: 'Lead',
        contacts: [], notes: [], history: [], version: 1,
      }),
    }));
    await page.goto('/partners/p1');
    await expect(page.getByTestId('stage-stepper')).toBeVisible({ timeout: 10000 });
  });

  test('all dividers have aria-hidden="true"', async ({ page }) => {
    const dividers = page.locator('.partner-stepper__divider');
    const count = await dividers.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(dividers.nth(i)).toHaveAttribute('aria-hidden', 'true');
    }
  });

  test('all stepper dots have aria-hidden="true"', async ({ page }) => {
    const dots = page.locator('.partner-stepper__dot');
    const count = await dots.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(dots.nth(i)).toHaveAttribute('aria-hidden', 'true');
    }
  });
});
