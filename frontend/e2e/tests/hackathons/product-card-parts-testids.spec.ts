// BUG-314: product-card name/desc/links lack testids while sibling
// product-card-{id} parent has one.
import { test, expect } from '../../fixtures';

test.describe('Product-card parts testids', () => {
  test('product card parts expose testids', async ({ page }) => {
    test.skip(true, 'Structural test - requires hackathon with products');
    await page.goto('/');
    await expect(page.getByTestId('product-card-name').first()).toBeVisible();
  });
});
