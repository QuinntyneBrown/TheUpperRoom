// T176: hackathon create form inputs should use dark palette tokens, not Slate/navy fallbacks
import { test, expect } from '../../fixtures';

test('hackathon create inputs use dark border token not Slate', async ({ page }) => {
  await page.route('**/api/auth/me', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: 'u1', displayName: 'Quinn', email: 'q@example.com', roles: ['Admin'] }) }));
  await page.route('**/api/partners', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) }));
  await page.goto('/hackathons/new');
  const input = page.locator('input[type="text"]').first();
  await expect(input).toBeVisible({ timeout: 5000 });
  const border = await input.evaluate((el) => getComputedStyle(el).borderBottomColor);
  // #475569 = rgb(71, 85, 105) — must NOT be Slate 600
  expect(border).not.toBe('rgb(71, 85, 105)');
  const bg = await input.evaluate((el) => getComputedStyle(el).backgroundColor);
  // #0f172a = rgb(15, 23, 42) — must NOT be navy
  expect(bg).not.toBe('rgb(15, 23, 42)');
});
