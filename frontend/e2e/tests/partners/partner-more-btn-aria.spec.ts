// BUG-176: partner-more-btn aria-label is the generic "More options".
// Personalize with the partner name. Mirrors BUG-160 (hackathon).
import { test, expect } from '../../fixtures';

test.describe('Partner more-options aria-label specificity', () => {
  test('aria-label includes the partner name', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead', 'Admin'] }),
    }));
    await page.route('**/api/partners/p1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'p1', name: 'Mountain Top Church', city: 'Toronto', stage: 'Lead',
        contacts: [], notes: [], history: [], version: 1,
      }),
    }));
    await page.goto('/partners/p1');
    const btn = page.getByTestId('partner-more-btn');
    await expect(btn).toBeVisible({ timeout: 10000 });
    const ariaLabel = await btn.getAttribute('aria-label');
    expect(ariaLabel).not.toBe('More options');
    expect(ariaLabel).toContain('Mountain Top Church');
  });
});
