// BUG-184: register page lacks an h1.
import { test, expect } from '../../fixtures';

test.describe('Register h1', () => {
  test('page has an h1 with testid="register-heading"', async ({ page }) => {
    await page.goto('/auth/register');
    const h1 = page.getByTestId('register-heading');
    await expect(h1).toHaveText(/Create account/);
    const tag = await h1.evaluate(el => el.tagName.toLowerCase());
    expect(tag).toBe('h1');
  });
});
