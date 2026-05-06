// BUG-272: partner-stepper should be ol/li.
import { test, expect } from '../../fixtures';

test.describe('Partner stepper list semantics', () => {
  test('stepper renders as <ol aria-label> with <li> steps', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/partners/p1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'p1', name: 'Mountain Top Church', city: 'Toronto', stage: 'Lead',
        contacts: [], notes: [], history: [], version: 1,
      }),
    }));
    await page.goto('/partners/p1');
    const ol = page.locator('ol.partner-stepper');
    await expect(ol).toBeVisible({ timeout: 10000 });
    await expect(ol).toHaveAttribute('aria-label', /partnership stages/i);
    expect(await ol.locator('li.partner-stepper__step').count()).toBeGreaterThan(0);
  });
});
