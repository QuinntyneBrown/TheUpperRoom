// BUG-355: shell skip-link "Skip to content" lacks a testid even though
// it's an a11y-critical landmark.
import { test, expect } from '../../fixtures';

test.describe('Shell skip-link testid', () => {
  test('skip-link exposes testid', async ({ page }) => {
    await page.goto('/auth/sign-in');
    const skip = page.getByTestId('shell-skip-link');
    await expect(skip).toHaveAttribute('href', '#main-content');
  });
});
