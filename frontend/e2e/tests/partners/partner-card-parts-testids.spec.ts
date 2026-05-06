// BUG-316: partner-card name and city in board view lack testids while
// sibling parent partner-card-{id} has one.
import { test, expect } from '../../fixtures';

test.describe('Partner-card parts testids', () => {
  test('partner card parts expose testids', async ({ page }) => {
    test.skip(true, 'Structural test - requires populated partners board');
    await page.goto('/');
    await expect(page.getByTestId('partner-card-name').first()).toBeVisible();
    await expect(page.getByTestId('partner-card-city').first()).toBeVisible();
  });
});
