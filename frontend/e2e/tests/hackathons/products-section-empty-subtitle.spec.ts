// BUG-313: products-section empty state goes from h3 directly with no
// subtitle, breaking the convention used by other empty states.
import { test, expect } from '../../fixtures';

test.describe('Products-section empty subtitle', () => {
  test('shows subtitle paragraph below title', async ({ page }) => {
    test.skip(true, 'Structural test - empty state requires hackathon with no products');
    await page.goto('/');
    await expect(page.getByTestId('products-empty-subtitle')).toBeVisible();
  });
});
