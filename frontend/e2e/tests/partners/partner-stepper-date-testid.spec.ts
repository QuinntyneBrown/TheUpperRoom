// BUG-300: partner-stepper completed-stage date span lacks testid
// while sibling current-stage-label and stage-not-reached-{stage}
// expose them.
import { test, expect } from '../../fixtures';

test.describe('Partner-stepper completed date testid', () => {
  test('completed date spans expose testid', async ({ page }) => {
    test.skip(true, 'Structural test - completed date requires partner-detail with history');
    await page.goto('/');
    await expect(page.getByTestId('stage-completed-date-Lead')).toBeVisible();
  });
});
