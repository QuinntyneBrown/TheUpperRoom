// Traces to: T178 — global search trigger renders 🔍 emoji instead of mat-icon
import { test, expect } from '../../fixtures';

test.describe('Global search trigger icon', () => {
  test('uses Material icon, not emoji', async ({ page, auth }) => {
    await auth.signInAs('city-lead');

    const trigger = page.getByTestId('global-search-trigger');
    await expect(trigger).toBeVisible();

    // Must contain a <mat-icon> element rendering the search glyph
    await expect(trigger.locator('mat-icon')).toBeVisible();
    await expect(trigger.locator('mat-icon')).toHaveText('search');

    // Must NOT contain the 🔍 emoji
    const text = (await trigger.textContent()) ?? '';
    expect(text).not.toContain('\u{1F50D}');
  });
});
