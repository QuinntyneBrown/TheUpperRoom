// BUG-142: deleted-hackathons-empty-title ends with a period;
// mirrors BUG-121/122/139/140/141 cross-feature strip.
import { test, expect } from '../../fixtures';

test.describe('Deleted-hackathons empty title has no trailing period', () => {
  test('"No deleted hackathons" h2 has no trailing period', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['Admin'] }),
    }));
    await page.route('**/api/hackathons/deleted**', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: '[]',
    }));
    await page.goto('/admin/deleted-hackathons');
    const title = page.getByTestId('deleted-hackathons-empty-title');
    await expect(title).toBeVisible({ timeout: 10000 });
    const text = await title.textContent();
    expect(text?.trim().endsWith('.')).toBe(false);
  });
});
