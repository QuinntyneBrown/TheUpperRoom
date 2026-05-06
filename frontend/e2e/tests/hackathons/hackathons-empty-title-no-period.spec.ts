// BUG-139: hackathons empty title ends with a period; mirrors the
// cross-feature strip from BUG-121/122.
import { test, expect } from '../../fixtures';

test.describe('Hackathons empty title has no trailing period', () => {
  test('"No hackathons yet" h2 has no trailing period', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/hackathons**', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: '[]',
    }));
    await page.goto('/hackathons');
    const title = page.getByTestId('hackathons-empty-title');
    await expect(title).toBeVisible({ timeout: 10000 });
    const text = await title.textContent();
    expect(text?.trim().endsWith('.')).toBe(false);
  });
});
