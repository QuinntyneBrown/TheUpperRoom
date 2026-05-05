// T158: sign-in links should use accent-primary colour, not browser default blue
import { test, expect } from '../../fixtures';

test.describe('Sign-in link colours', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/sign-in');
    await expect(page.getByTestId('sign-in-submit-btn')).toBeVisible({ timeout: 5000 });
  });

  test('"Forgot password?" link has accent-primary colour', async ({ page }) => {
    const link = page.getByRole('link', { name: 'Forgot password?' });
    const color = await link.evaluate((el) => getComputedStyle(el).color);
    // accent-primary: rgb(159, 134, 255)
    expect(color).toBe('rgb(159, 134, 255)');
  });

  test('"Forgot password?" link has no underline by default', async ({ page }) => {
    const link = page.getByRole('link', { name: 'Forgot password?' });
    const decoration = await link.evaluate((el) => getComputedStyle(el).textDecorationLine);
    expect(decoration).toBe('none');
  });

  test('"Request access" link has accent-primary colour', async ({ page }) => {
    const link = page.getByRole('link', { name: 'Request access' });
    const color = await link.evaluate((el) => getComputedStyle(el).color);
    expect(color).toBe('rgb(159, 134, 255)');
  });

  test('"Request access" link has no underline by default', async ({ page }) => {
    const link = page.getByRole('link', { name: 'Request access' });
    const decoration = await link.evaluate((el) => getComputedStyle(el).textDecorationLine);
    expect(decoration).toBe('none');
  });
});
