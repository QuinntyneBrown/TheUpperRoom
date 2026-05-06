// BUG-183: sign-in page lacks an h1.
import { test, expect } from '../../fixtures';

test.describe('Sign-in h1', () => {
  test('page has an h1 with testid="sign-in-heading"', async ({ page }) => {
    await page.goto('/auth/sign-in');
    const h1 = page.getByTestId('sign-in-heading');
    await expect(h1).toHaveText(/Sign in/);
    const tag = await h1.evaluate(el => el.tagName.toLowerCase());
    expect(tag).toBe('h1');
  });
});
