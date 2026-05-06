// BUG-287: partner-contacts-panel should be section with aria-labelledby.
import { test, expect } from '../../fixtures';

test.describe('Partner contacts panel section', () => {
  test('panel is a section with aria-labelledby', async ({ page }) => {
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
    const section = page.locator('section.partner-contacts');
    await expect(section).toBeVisible({ timeout: 10000 });
    await expect(section).toHaveAttribute('aria-labelledby', 'partner-contacts-section-title');
  });
});
