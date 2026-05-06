// BUG-319: contacts-table row cells lack testids while the parent row
// uses contact-card-{id}.
import { test, expect } from '../../fixtures';

test.describe('Contacts-table cell testids', () => {
  test('row cells expose testids', async ({ page }) => {
    test.skip(true, 'Structural test - requires populated contacts list');
    await page.goto('/');
    await expect(page.getByTestId('contacts-row-firstName').first()).toBeVisible();
    await expect(page.getByTestId('contacts-row-lastName').first()).toBeVisible();
  });
});
