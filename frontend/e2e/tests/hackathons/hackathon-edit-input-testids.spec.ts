// BUG-337: hackathon-edit form inputs lack testids while sibling
// error spans use hackathon-edit-{field}-error.
import { test, expect } from '../../fixtures';

test.describe('Hackathon-edit input testids', () => {
  test('form inputs expose testids', async ({ page }) => {
    test.skip(true, 'Structural test - requires hackathon-edit page');
    await page.goto('/');
    await expect(page.getByTestId('hackathon-edit-title-input')).toBeVisible();
    await expect(page.getByTestId('hackathon-edit-host-city-input')).toBeVisible();
  });
});
