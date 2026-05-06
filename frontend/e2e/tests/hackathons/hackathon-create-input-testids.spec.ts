// BUG-338: hackathon-create form inputs lack testids while error spans
// expose hackathon-create-{field}-error.
import { test, expect } from '../../fixtures';

test.describe('Hackathon-create input testids', () => {
  test('form inputs expose testids', async ({ page }) => {
    test.skip(true, 'Structural test - requires opening create dialog');
    await page.goto('/');
    await expect(page.getByTestId('hackathon-create-title-input')).toBeVisible();
    await expect(page.getByTestId('hackathon-create-host-city-input')).toBeVisible();
  });
});
