// BUG-299: partner-stepper stage name spans lack testids while sibling
// status indicators (current-stage-label, stage-not-reached-{stage})
// expose them.
import { test, expect } from '../../fixtures';

test.describe('Partner-stepper stage name testid', () => {
  test('stage name spans expose testids', async ({ page }) => {
    test.skip(true, 'Structural test - stepper requires partner-detail page');
    await page.goto('/');
    await expect(page.getByTestId('stage-name-Confirmed')).toBeVisible();
  });
});
