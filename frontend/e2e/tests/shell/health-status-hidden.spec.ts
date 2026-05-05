import { test, expect } from '../../fixtures';

test.describe('Shell sidebar — health status not visible', () => {
  test('health-status element is not visible to the user', async ({ page }) => {
    await page.goto('/contacts');
    const healthEl = page.getByTestId('health-status');
    await expect(healthEl).toHaveCount(0);
  });
});
