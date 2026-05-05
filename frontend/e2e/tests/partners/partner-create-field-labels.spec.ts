// T99 — partner create form field labels must match design
import { test, expect } from '../../fixtures';

test.describe('Partner create form field labels', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/partners/new');
  });

  test('name field label is "Partner name"', async ({ page }) => {
    await expect(page.getByLabel('Partner name')).toBeVisible();
  });

  test('stage field label is "Stage"', async ({ page }) => {
    await expect(page.getByText('Stage')).toBeVisible();
  });

  test('name field label is not "Organization name"', async ({ page }) => {
    await expect(page.getByLabel('Organization name')).not.toBeVisible();
  });
});
