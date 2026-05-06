// BUG-160: hackathon-more-btn aria-label is the generic
// "More options". Personalize with the hackathon title so a screen
// reader announces context.
import { test, expect } from '../../fixtures';

test.describe('Hackathon more-options aria-label specificity', () => {
  test('aria-label includes the hackathon title', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/hackathons/h1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'h1', title: 'Spring Hack 2026', startsOn: '2026-05-01', endsOn: '2026-05-03',
        hostCity: 'Toronto', partners: [], products: [], history: [], version: 1,
      }),
    }));
    await page.goto('/hackathons/h1');
    const btn = page.getByTestId('hackathon-more-btn');
    await expect(btn).toBeVisible({ timeout: 10000 });
    const ariaLabel = await btn.getAttribute('aria-label');
    expect(ariaLabel).not.toBe('More options');
    expect(ariaLabel).toContain('Spring Hack 2026');
  });
});
