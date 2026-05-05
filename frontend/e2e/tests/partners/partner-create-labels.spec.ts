// T89: Create Partner form title and save button must match design
// Design ref: ui-design.pen "Tablet / New Partner Modal" — title="New partner", cta="Create partner"
import { test, expect } from '../../fixtures';

test.describe('create partner form labels', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/partners/new');
  });

  test('dialog title is "New partner"', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'New partner' })).toBeVisible();
  });

  test('save button reads "Create partner"', async ({ page }) => {
    await expect(page.getByTestId('add-partner-btn')).toHaveText('Create partner');
  });
});
