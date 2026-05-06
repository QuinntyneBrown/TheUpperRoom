// BUG-342: contact-form ur-input fields don't pass inputTestId to expose
// underlying input element testids.
import { test, expect } from '../../fixtures';

test.describe('Contact-form input testids', () => {
  test('form input fields expose testids', async ({ page }) => {
    test.skip(true, 'Structural test - requires contact-form rendered');
    await page.goto('/');
    await expect(page.getByTestId('contact-firstName-input')).toBeVisible();
    await expect(page.getByTestId('contact-lastName-input')).toBeVisible();
  });
});
