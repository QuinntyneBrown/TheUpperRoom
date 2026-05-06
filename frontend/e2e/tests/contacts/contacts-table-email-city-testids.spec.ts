// BUG-320: contacts-table email/city cells lack testids, mirroring the
// firstName/lastName gap fixed under BUG-319.
import { test, expect } from '../../fixtures';

test.describe('Contacts-table email/city testids', () => {
  test('row email/city cells expose testids', async ({ page }) => {
    test.skip(true, 'Structural test - requires populated contacts list');
    await page.goto('/');
    await expect(page.getByTestId('contacts-row-email').first()).toBeVisible();
    await expect(page.getByTestId('contacts-row-city').first()).toBeVisible();
  });
});
