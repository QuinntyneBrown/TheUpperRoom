// BUG-153: partner-stepper "check" icon span (material-symbols-
// outlined) is decorative but not aria-hidden.
import { test, expect } from '../../fixtures';

test.describe('Partner stepper check aria-hidden', () => {
  test('check icon span has aria-hidden="true"', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/partners/p1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'p1', name: 'Mountain Top Church', city: 'Toronto', stage: 'Confirmed',
        contacts: [], notes: [], history: [], version: 1,
      }),
    }));
    await page.goto('/partners/p1');
    const stepper = page.getByTestId('stage-stepper');
    await expect(stepper).toBeVisible({ timeout: 10000 });
    const checks = stepper.locator('.material-symbols-outlined.partner-stepper__check');
    const count = await checks.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      await expect(checks.nth(i)).toHaveAttribute('aria-hidden', 'true');
    }
  });
});
